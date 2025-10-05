import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/root/app.state';
import { selectToken } from '../../store/features/auth/auth.selectors';
import * as AuthActions from '../../store/features/auth/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from store
    let token: string | null = null;
    this.store
      .select(selectToken)
      .subscribe((t) => (token = t))
      .unsubscribe();

    // Add authorization header if token exists
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, try to refresh
          return this.handle401Error(req, next);
        }

        if (error.status === 403) {
          // Forbidden, redirect to unauthorized page
          this.store.dispatch(AuthActions.logout());
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Try to refresh token
    this.store.dispatch(AuthActions.refreshToken());

    // For now, just logout - in a real app, you'd retry the request with new token
    this.store.dispatch(AuthActions.logout());

    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
        })
    );
  }
}
