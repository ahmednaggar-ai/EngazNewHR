import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectToken = createSelector(selectAuthState, (state) => state.token);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectRefreshToken = createSelector(selectAuthState, (state) => state.refreshToken);

// Loading selectors
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectLoginLoading = createSelector(selectAuthState, (state) => state.loginLoading);

export const selectRegisterLoading = createSelector(
  selectAuthState,
  (state) => state.registerLoading
);

export const selectProfileLoading = createSelector(
  selectAuthState,
  (state) => state.profileLoading
);

export const selectPasswordResetLoading = createSelector(
  selectAuthState,
  (state) => state.passwordResetLoading
);

// Error selectors
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectLoginError = createSelector(selectAuthState, (state) => state.loginError);

export const selectRegisterError = createSelector(selectAuthState, (state) => state.registerError);

export const selectProfileError = createSelector(selectAuthState, (state) => state.profileError);

export const selectPasswordResetError = createSelector(
  selectAuthState,
  (state) => state.passwordResetError
);

// Token management selectors
export const selectTokenExpiry = createSelector(selectAuthState, (state) => state.tokenExpiry);

export const selectIsTokenExpired = createSelector(
  selectAuthState,
  (state) => state.isTokenExpired
);

export const selectIsTokenValid = createSelector(selectTokenExpiry, (expiry) =>
  expiry ? Date.now() < expiry : false
);

// Auto-login selectors
export const selectAutoLoginAttempted = createSelector(
  selectAuthState,
  (state) => state.autoLoginAttempted
);

// UI state selectors
export const selectShowLoginModal = createSelector(
  selectAuthState,
  (state) => state.showLoginModal
);

export const selectShowRegisterModal = createSelector(
  selectAuthState,
  (state) => state.showRegisterModal
);

export const selectShowPasswordResetModal = createSelector(
  selectAuthState,
  (state) => state.showPasswordResetModal
);

// Computed selectors
export const selectUserFullName = createSelector(selectUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : null
);

export const selectUserInitials = createSelector(selectUser, (user) =>
  user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : null
);

export const selectUserRole = createSelector(selectUser, (user) => user?.role || null);

export const selectUserDepartment = createSelector(selectUser, (user) => user?.department || null);

export const selectUserPosition = createSelector(selectUser, (user) => user?.position || null);

export const selectIsAdmin = createSelector(selectUserRole, (role) => role === 'admin');

export const selectIsHR = createSelector(
  selectUserRole,
  (role) => role === 'hr' || role === 'admin'
);

export const selectIsManager = createSelector(
  selectUserRole,
  (role) => role === 'manager' || role === 'hr' || role === 'admin'
);

// Permission selectors
export const selectCanManageEmployees = createSelector(selectUserRole, (role) =>
  ['admin', 'hr'].includes(role || '')
);

export const selectCanViewAllEmployees = createSelector(selectUserRole, (role) =>
  ['admin', 'hr', 'manager'].includes(role || '')
);

export const selectCanEditProfile = createSelector(
  selectIsAuthenticated,
  (isAuthenticated) => isAuthenticated
);

// Auth status selectors
export const selectAuthStatus = createSelector(
  selectIsAuthenticated,
  selectAuthLoading,
  selectAutoLoginAttempted,
  (isAuthenticated, loading, autoLoginAttempted) => ({
    isAuthenticated,
    loading,
    autoLoginAttempted,
    isReady: autoLoginAttempted && !loading,
  })
);

// Combined loading selector
export const selectAnyAuthLoading = createSelector(
  selectAuthLoading,
  selectLoginLoading,
  selectRegisterLoading,
  selectProfileLoading,
  selectPasswordResetLoading,
  (authLoading, loginLoading, registerLoading, profileLoading, passwordResetLoading) =>
    authLoading || loginLoading || registerLoading || profileLoading || passwordResetLoading
);

// Combined error selector
export const selectAnyAuthError = createSelector(
  selectAuthError,
  selectLoginError,
  selectRegisterError,
  selectProfileError,
  selectPasswordResetError,
  (authError, loginError, registerError, profileError, passwordResetError) =>
    authError || loginError || registerError || profileError || passwordResetError
);
