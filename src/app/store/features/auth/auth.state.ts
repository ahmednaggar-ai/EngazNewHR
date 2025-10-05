import { User } from '../../models/user.model';

export interface AuthState {
  // User data
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Loading states
  loading: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
  profileLoading: boolean;
  passwordResetLoading: boolean;
  
  // Error states
  error: string | null;
  loginError: string | null;
  registerError: string | null;
  profileError: string | null;
  passwordResetError: string | null;
  
  // Token management
  tokenExpiry: number | null;
  isTokenExpired: boolean;
  
  // Auto-login
  autoLoginAttempted: boolean;
  
  // UI state
  showLoginModal: boolean;
  showRegisterModal: boolean;
  showPasswordResetModal: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  loginLoading: false,
  registerLoading: false,
  profileLoading: false,
  passwordResetLoading: false,
  error: null,
  loginError: null,
  registerError: null,
  profileError: null,
  passwordResetError: null,
  tokenExpiry: null,
  isTokenExpired: false,
  autoLoginAttempted: false,
  showLoginModal: false,
  showRegisterModal: false,
  showPasswordResetModal: false,
};
