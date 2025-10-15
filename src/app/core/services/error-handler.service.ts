import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  handleError(error: HttpErrorResponse): void {
    console.error('HTTP Error:', error);
    
    switch (error.status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 404:
        this.handleNotFound();
        break;
      case 500:
        this.handleServerError();
        break;
      case 503:
        this.handleServiceUnavailable();
        break;
      default:
        this.handleGenericError(error);
    }
  }

  private handleUnauthorized(): void {
    this.snackBar.open('Session expired. Please login again.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleForbidden(): void {
    this.snackBar.open('Access denied. You do not have permission to perform this action.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    this.router.navigate(['/unauthorized']);
  }

  private handleNotFound(): void {
    this.snackBar.open('Resource not found.', 'Close', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
    this.router.navigate(['/not-found']);
  }

  private handleServerError(): void {
    this.snackBar.open('Internal server error. Please try again later.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private handleServiceUnavailable(): void {
    this.snackBar.open('Service temporarily unavailable. Please try again later.', 'Close', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }

  private handleGenericError(error: HttpErrorResponse): void {
    let message = 'An unexpected error occurred.';
    
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Get user-friendly error message for authentication errors
   */
  getAuthErrorMessage(error: any): string {
    if (error.error?.message) {
      const backendMessage = error.error.message.toLowerCase();
      
      if (backendMessage.includes('error occurred while processing') || 
          backendMessage.includes('an error occurred while processing')) {
        return 'You must register first';
      } else if (backendMessage.includes('user not found') || 
                 backendMessage.includes('user does not exist')) {
        return 'You must register first';
      } else if (backendMessage.includes('invalid credentials') || 
                 backendMessage.includes('bad credentials')) {
        return 'Invalid email or password';
      } else {
        return error.error.message;
      }
    } else if (error.status === 401) {
      return 'You must register first';
    } else if (error.status === 403) {
      return 'Account is locked or disabled.';
    }
    
    return 'Authentication failed.';
  }

  /**
   * Handle authentication errors specifically
   */
  handleAuthError(error: any): void {
    console.error('Authentication error:', error);
    
    const message = this.getAuthErrorMessage(error);

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Handle API errors with custom messages
   */
  handleApiError(error: HttpErrorResponse, customMessage?: string): void {
    if (customMessage) {
      this.snackBar.open(customMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.handleError(error);
  }

  /**
   * Show success message
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show warning message
   */
  showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
  }

  /**
   * Show info message
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
