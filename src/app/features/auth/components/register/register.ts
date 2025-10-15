import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, RegisterRequest } from '../../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {
    // Test backend connectivity on component initialization
    this.testBackendConnectivity();
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    console.log('=== REGISTRATION FORM SUBMISSION ===');
    console.log('Form submission attempted');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form errors:', this.registerForm.errors);
    console.log('Form value:', this.registerForm.value);
    console.log('Is loading:', this.isLoading);
    
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.registerForm);
    
    if (this.registerForm.valid && !this.isLoading) {
      console.log('Form is valid, proceeding with registration...');
      this.isLoading = true;
      this.errorMessage = '';

      const registerRequest: RegisterRequest = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };
      
      console.log('Sending registration request:', registerRequest);
      console.log('AuthService available:', !!this.authService);
      console.log('ErrorHandler available:', !!this.errorHandler);
      
      try {
        this.authService.register(registerRequest).subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.isLoading = false;
            this.errorHandler.showSuccess('Registration successful! You are now logged in.');
            this.router.navigate(['/animals']);
          },
          error: (error) => {
            console.error('Registration error details:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error error:', error.error);
            this.isLoading = false;
            this.errorHandler.handleAuthError(error);
            this.errorMessage = this.errorHandler.getAuthErrorMessage(error);
          }
        });
      } catch (error) {
        console.error('Exception during registration:', error);
        this.isLoading = false;
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    } else {
      console.log('Form is invalid, not submitting');
      console.log('Form validation errors:', this.getFormValidationErrors());
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters long`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  private testBackendConnectivity(): void {
    console.log('=== TESTING BACKEND CONNECTIVITY ===');
    console.log('Environment API URL:', 'http://localhost:8765');
    console.log('Registration endpoint:', 'http://localhost:8765/user-management/auth/register');
    
    // Simple fetch test
    fetch('http://localhost:8765/user-management/auth/register', {
      method: 'OPTIONS',
      mode: 'cors'
    })
    .then(response => {
      console.log('Backend connectivity test - OPTIONS response:', response.status);
    })
    .catch(error => {
      console.error('Backend connectivity test failed:', error);
      console.error('This might indicate CORS issues or backend is not running');
    });
  }
}
