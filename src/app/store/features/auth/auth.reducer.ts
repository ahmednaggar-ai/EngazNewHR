import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loginLoading: true,
    loginError: null,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loginLoading: false,
    loginError: null,
    error: null,
    showLoginModal: false,
    tokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    isTokenExpired: false,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loginLoading: false,
    loginError: error,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.logoutSuccess, () => initialAuthState),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    registerLoading: true,
    registerError: null,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    registerLoading: false,
    registerError: null,
    error: null,
    showRegisterModal: false,
    tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    isTokenExpired: false,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    registerLoading: false,
    registerError: error,
    error,
  })),

  // Token Refresh
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: false,
    error: null,
    tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    isTokenExpired: false,
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isTokenExpired: true,
  })),

  // Password Reset
  on(AuthActions.requestPasswordReset, (state) => ({
    ...state,
    passwordResetLoading: true,
    passwordResetError: null,
    error: null,
  })),

  on(AuthActions.requestPasswordResetSuccess, (state) => ({
    ...state,
    passwordResetLoading: false,
    passwordResetError: null,
    error: null,
  })),

  on(AuthActions.requestPasswordResetFailure, (state, { error }) => ({
    ...state,
    passwordResetLoading: false,
    passwordResetError: error,
    error,
  })),

  on(AuthActions.resetPassword, (state) => ({
    ...state,
    passwordResetLoading: true,
    passwordResetError: null,
    error: null,
  })),

  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    passwordResetLoading: false,
    passwordResetError: null,
    error: null,
    showPasswordResetModal: false,
  })),

  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    passwordResetLoading: false,
    passwordResetError: error,
    error,
  })),

  // Profile
  on(AuthActions.loadProfile, (state) => ({
    ...state,
    profileLoading: true,
    profileError: null,
    error: null,
  })),

  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    profileLoading: false,
    profileError: null,
    error: null,
  })),

  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    profileLoading: false,
    profileError: error,
    error,
  })),

  on(AuthActions.updateProfile, (state) => ({
    ...state,
    profileLoading: true,
    profileError: null,
    error: null,
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    profileLoading: false,
    profileError: null,
    error: null,
  })),

  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    profileLoading: false,
    profileError: error,
    error,
  })),

  // Auto Login
  on(AuthActions.autoLogin, (state) => ({
    ...state,
    loading: true,
    autoLoginAttempted: true,
  })),

  on(AuthActions.autoLoginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
    tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    isTokenExpired: false,
  })),

  on(AuthActions.autoLoginFailure, (state) => ({
    ...state,
    loading: false,
    autoLoginAttempted: true,
  })),

  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
    loginError: null,
    registerError: null,
    profileError: null,
    passwordResetError: null,
  })),

  // Check Auth Status
  on(AuthActions.checkAuthStatus, (state) => ({
    ...state,
    loading: true,
  }))
);
