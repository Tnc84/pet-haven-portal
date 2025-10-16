import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Disable form controls during loading
      this.loginForm.disable();

      const loginRequest: LoginRequest = this.loginForm.value;
      
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.loginForm.enable(); // Re-enable form controls
          this.errorHandler.showSuccess('Login successful!');
          
          // Wait for authentication state to be properly set before redirecting
          this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuthenticated => {
            if (isAuthenticated) {
              // Redirect to return URL or default dashboard
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/animals';
              this.router.navigate([returnUrl]);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.loginForm.enable(); // Re-enable form controls
          this.errorHandler.handleAuthError(error);
          this.errorMessage = this.errorHandler.getAuthErrorMessage(error);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}
