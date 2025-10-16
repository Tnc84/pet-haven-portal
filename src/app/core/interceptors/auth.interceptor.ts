import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Global state for token refresh
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Add access token to requests (except auth endpoints)
  if (!isAuthEndpoint(req.url)) {
    const token = authService.getAccessToken();
    console.log('Auth interceptor - URL:', req.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Authorization header added to request');
    } else {
      console.warn('No token available for authenticated request to:', req.url);
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint(req.url)) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/');
}

function handle401Error(req: HttpRequest<any>, next: any, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return next(addTokenHeader(req, response.accessToken)) as Observable<HttpEvent<any>>;
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(req, token!)) as Observable<HttpEvent<any>>)
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

