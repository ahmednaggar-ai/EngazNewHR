import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as AuthActions from './auth.actions';
import { selectToken, selectRefreshToken } from './auth.selectors';
import { AppState } from '../../root/app.state';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response: any) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  // Register Effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((action) =>
        this.authService.register(action.userData, action.password).pipe(
          map((response: any) =>
            AuthActions.registerSuccess({
              user: response.user,
              token: response.token,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error.message || 'Registration failed',
              })
            )
          )
        )
      )
    )
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([action, token]) =>
        this.authService.logout(token).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(
              AuthActions.logoutFailure({
                error: error.message || 'Logout failed',
              })
            )
          )
        )
      )
    )
  );

  // Auto Login Effect
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(() =>
        this.authService.autoLogin().pipe(
          map((response: any) =>
            AuthActions.autoLoginSuccess({
              user: response.user,
              token: response.token,
            })
          ),
          catchError(() => of(AuthActions.autoLoginFailure()))
        )
      )
    )
  );

  // Token Refresh Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(this.store.select(selectRefreshToken)),
      switchMap(([action, refreshToken]) =>
        this.authService.refreshToken(refreshToken).pipe(
          map((response: any) =>
            AuthActions.refreshTokenSuccess({
              token: response.token,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.refreshTokenFailure({
                error: error.message || 'Token refresh failed',
              })
            )
          )
        )
      )
    )
  );

  // Load Profile Effect
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([action, token]) =>
        this.authService.getProfile(token).pipe(
          map((user: any) => AuthActions.loadProfileSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.loadProfileFailure({
                error: error.message || 'Failed to load profile',
              })
            )
          )
        )
      )
    )
  );

  // Update Profile Effect
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([action, token]) =>
        this.authService.updateProfile(token, action.userData).pipe(
          map((user: any) => AuthActions.updateProfileSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.updateProfileFailure({
                error: error.message || 'Failed to update profile',
              })
            )
          )
        )
      )
    )
  );

  // Password Reset Request Effect
  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      switchMap((action) =>
        this.authService.requestPasswordReset(action.email).pipe(
          map(() => AuthActions.requestPasswordResetSuccess()),
          catchError((error) =>
            of(
              AuthActions.requestPasswordResetFailure({
                error: error.message || 'Failed to request password reset',
              })
            )
          )
        )
      )
    )
  );

  // Reset Password Effect
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      switchMap((action) =>
        this.authService.resetPassword(action.token, action.newPassword).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError((error) =>
            of(
              AuthActions.resetPasswordFailure({
                error: error.message || 'Failed to reset password',
              })
            )
          )
        )
      )
    )
  );

  // Navigation Effects
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  // Token expiry check effect
  checkTokenExpiry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([action, token]) => {
        if (token && this.authService.isTokenExpired(token)) {
          return of(AuthActions.refreshToken());
        }
        return of(AuthActions.autoLogin());
      })
    )
  );
}
