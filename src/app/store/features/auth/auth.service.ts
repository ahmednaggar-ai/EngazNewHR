import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  register(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    password: string
  ): Observable<AuthResponse> {
    const registerData: RegisterRequest = {
      ...userData,
      password,
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData);
  }

  logout(token: string | null): Observable<void> {
    if (!token) {
      return of(void 0);
    }
    return this.http.post<void>(`${this.apiUrl}/logout`, { token });
  }

  refreshToken(refreshToken: string | null): Observable<{ token: string }> {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, { refreshToken });
  }

  getProfile(token: string | null): Observable<User> {
    if (!token) {
      throw new Error('No token available');
    }
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateProfile(token: string | null, userData: Partial<User>): Observable<User> {
    if (!token) {
      throw new Error('No token available');
    }
    return this.http.put<User>(`${this.apiUrl}/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  requestPasswordReset(email: string): Observable<void> {
    const resetData: PasswordResetRequest = { email };
    return this.http.post<void>(`${this.apiUrl}/password-reset-request`, resetData);
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    const resetData: PasswordResetConfirm = { token, newPassword };
    return this.http.post<void>(`${this.apiUrl}/password-reset-confirm`, resetData);
  }

  autoLogin(): Observable<AuthResponse> {
    const token = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();

    if (!token || !refreshToken) {
      throw new Error('No stored credentials');
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      return this.refreshToken(refreshToken).pipe(
        map((response) => ({
          user: this.getStoredUser()!,
          token: response.token,
          refreshToken: refreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours
        }))
      );
    }

    // Token is still valid, return stored data
    return of({
      user: this.getStoredUser()!,
      token: token,
      refreshToken: refreshToken,
      expiresIn: 24 * 60 * 60,
    });
  }

  // Token management methods
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('auth_token', authResponse.token);
    localStorage.setItem('refresh_token', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Utility methods
  hasRole(requiredRole: string): boolean {
    const user = this.getStoredUser();
    if (!user) return false;

    const roleHierarchy = {
      employee: 1,
      manager: 2,
      hr: 3,
      admin: 4,
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  canAccess(permission: string): boolean {
    const user = this.getStoredUser();
    if (!user) return false;

    const permissions = {
      admin: ['*'], // Admin has all permissions
      hr: ['manage_employees', 'view_employees', 'manage_departments'],
      manager: ['view_team', 'manage_team'],
      employee: ['view_own_profile', 'edit_own_profile'],
    };

    const userPermissions = permissions[user.role as keyof typeof permissions] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }
}
