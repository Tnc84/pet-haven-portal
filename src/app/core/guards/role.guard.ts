import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const expectedRoles = route.data['roles'] as string[];
  const user = authService.currentUserValue;

  if (user && expectedRoles.includes(user.role)) {
    return true;
  }

  // Not authorized, redirect to home
  router.navigate(['/']);
  return false;
};

