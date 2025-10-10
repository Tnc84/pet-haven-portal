import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options) as Observable<T>;
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body) as Observable<T>;
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`) as Observable<T>;
  }

  /**
   * Authenticated GET request (token automatically added by interceptor)
   */
  getAuthenticated<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  /**
   * Authenticated POST request (token automatically added by interceptor)
   */
  postAuthenticated<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Authenticated PUT request (token automatically added by interceptor)
   */
  putAuthenticated<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Authenticated DELETE request (token automatically added by interceptor)
   */
  deleteAuthenticated<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Authentication endpoints (no token required)
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${environment.auth.login}`, credentials, {
      withCredentials: true
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${environment.auth.register}`, userData, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}${environment.auth.refresh}`, {}, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}${environment.auth.logout}`, {}, {
      withCredentials: true
    });
  }
}

