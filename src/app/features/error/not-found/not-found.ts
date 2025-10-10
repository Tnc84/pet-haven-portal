import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container">
      <mat-card class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon class="error-icon">pets</mat-icon>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <p>It might have been moved, deleted, or you entered the wrong URL.</p>
            <button mat-raised-button color="primary" routerLink="/animals">
              <mat-icon>home</mat-icon>
              Go Home
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .error-card {
      max-width: 500px;
      width: 100%;
    }
    
    .error-content {
      text-align: center;
      padding: 20px;
    }
    
    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #2196f3;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 16px;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}
}
