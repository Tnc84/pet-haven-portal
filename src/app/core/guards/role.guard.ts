import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const requiredRoles = route.data['roles'] as string[];
  
  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && authService.hasAnyRole(requiredRoles)) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};

