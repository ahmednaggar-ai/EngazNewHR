import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

// NgRx imports
import { AppState } from '../../../store/root/app.state';
import * as AuthActions from '../../../store/features/auth/auth.actions';
import * as AuthSelectors from '../../../store/features/auth/auth.selectors';
import * as SharedActions from '../../../store/shared/shared.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email"
            />
            <div
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              class="error-message"
            >
              Please enter a valid email address
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="
                loginForm.get('password')?.invalid && loginForm.get('password')?.touched
              "
              placeholder="Enter your password"
            />
            <div
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              class="error-message"
            >
              Password is required
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe" />
              <span class="checkmark"></span>
              Remember me
            </label>
          </div>

          <!-- Error Display -->
          <div *ngIf="loginError$ | async as error" class="error-banner">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="loginForm.invalid || (loginLoading$ | async)"
          >
            <span *ngIf="!(loginLoading$ | async)">Sign In</span>
            <span *ngIf="loginLoading$ | async">Signing In...</span>
          </button>
        </form>

        <!-- Additional Links -->
        <div class="login-footer">
          <a href="#" (click)="forgotPassword($event)" class="link"> Forgot your password? </a>
          <div class="divider">or</div>
          <a href="#" (click)="openRegister($event)" class="link"> Create a new account </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .login-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 40px;
        width: 100%;
        max-width: 400px;
      }

      .login-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .login-header h2 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 28px;
      }

      .login-header p {
        margin: 0;
        color: #666;
        font-size: 16px;
      }

      .login-form {
        margin-bottom: 30px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        color: #333;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }

      .form-control:focus {
        outline: none;
        border-color: #667eea;
      }

      .form-control.error {
        border-color: #e74c3c;
      }

      .error-message {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 4px;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #666;
      }

      .checkbox-label input[type='checkbox'] {
        margin-right: 8px;
      }

      .error-banner {
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary {
        background: #667eea;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #5a6fd8;
      }

      .btn-primary:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .btn-full {
        width: 100%;
      }

      .login-footer {
        text-align: center;
      }

      .link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
      }

      .link:hover {
        text-decoration: underline;
      }

      .divider {
        margin: 15px 0;
        color: #999;
        font-size: 14px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loginForm: FormGroup;
  loginLoading$: Observable<boolean>;
  loginError$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store<AppState>, private router: Router) {
    // Initialize form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Initialize selectors
    this.loginLoading$ = this.store.select(AuthSelectors.selectLoginLoading);
    this.loginError$ = this.store.select(AuthSelectors.selectLoginError);
  }

  ngOnInit(): void {
    // Listen for successful login
    this.store
      .select(AuthSelectors.selectIsAuthenticated)
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

    // Clear errors when form changes
    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.store.dispatch(AuthActions.clearAuthError());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.store.dispatch(AuthActions.login({ email, password }));

      // Show loading notification
      this.store.dispatch(
        SharedActions.showNotification({
          notificationType: 'info',
          title: 'Signing In',
          message: 'Please wait while we sign you in...',
          duration: 2000,
        })
      );
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    this.store.dispatch(
      SharedActions.openModal({
        modalId: 'forgot-password',
        size: 'md',
      })
    );
  }

  openRegister(event: Event): void {
    event.preventDefault();
    this.store.dispatch(
      SharedActions.openModal({
        modalId: 'register',
        size: 'lg',
      })
    );
  }
}
