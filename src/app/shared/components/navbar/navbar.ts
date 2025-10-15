import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  logout(): void {
    console.log('Logout initiated');
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.snackBar.open('Logout failed, but you have been logged out locally', 'Close', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
    });
  }
}
