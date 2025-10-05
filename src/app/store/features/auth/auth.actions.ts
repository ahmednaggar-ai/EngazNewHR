import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Login Actions
export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);

export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

// Token Refresh Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Password Reset Actions
export const requestPasswordReset = createAction(
  '[Auth] Request Password Reset',
  props<{ email: string }>()
);

export const requestPasswordResetSuccess = createAction('[Auth] Request Password Reset Success');

export const requestPasswordResetFailure = createAction(
  '[Auth] Request Password Reset Failure',
  props<{ error: string }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ token: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction('[Auth] Reset Password Success');

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

// Profile Actions
export const loadProfile = createAction('[Auth] Load Profile');

export const loadProfileSuccess = createAction(
  '[Auth] Load Profile Success',
  props<{ user: User }>()
);

export const loadProfileFailure = createAction(
  '[Auth] Load Profile Failure',
  props<{ error: string }>()
);

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ userData: Partial<User> }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Auto Login Actions
export const autoLogin = createAction('[Auth] Auto Login');

export const autoLoginSuccess = createAction(
  '[Auth] Auto Login Success',
  props<{ user: User; token: string }>()
);

export const autoLoginFailure = createAction('[Auth] Auto Login Failure');

// Clear Error Actions
export const clearAuthError = createAction('[Auth] Clear Error');

// Check Auth Status
export const checkAuthStatus = createAction('[Auth] Check Auth Status');
