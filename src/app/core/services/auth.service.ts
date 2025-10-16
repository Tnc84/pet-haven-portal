import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  role: string;
}

export interface RefreshResponse {
  accessToken: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = `${environment.apiUrl}/user-management`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private initializeAuth(): void {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    
    if (token && user && !this.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    } else {
      this.clearAuthData();
    }
  }

  /**
   * User Login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials, {
      withCredentials: true // Important for HttpOnly cookies
    }).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * User Registration
   */
  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/register`, userData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Refresh Access Token
   */
  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.API_BASE_URL}/auth/refresh`, {}, {
      withCredentials: true // Sends refresh token cookie
    }).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  /**
   * User Logout
   */
  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(error);
      })
    );
  }

  /**
   * Get Access Token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Get current user
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user && roles.includes(user.role);
  }

  /**
   * Set authentication data
   */
  private setAuthData(response: LoginResponse): void {
    console.log('Setting auth data:', response);
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      userId: response.userId,
      email: response.email,
      role: response.role
    }));
    
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next({
      userId: response.userId,
      email: response.email,
      role: response.role
    });
    console.log('Auth state updated - isAuthenticated: true');
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Authentication error:', error);
    return throwError(error);
  };

  // Legacy methods for backward compatibility
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get currentUser(): Observable<any> {
    return this.currentUser$;
  }

  getToken(): string | null {
    return this.getAccessToken();
  }
}

