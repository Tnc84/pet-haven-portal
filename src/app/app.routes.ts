import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/animals', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/components/register/register').then(m => m.Register)
  },
  {
    path: 'animals',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/animals/components/animal-list/animal-list').then(m => m.AnimalList)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/animals/components/animal-form/animal-form').then(m => m.AnimalForm)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/animals/components/animal-form/animal-form').then(m => m.AnimalForm)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/animals/components/animal-detail/animal-detail').then(m => m.AnimalDetail)
      }
    ]
    // canActivate: [authGuard]  // Uncomment when authentication is implemented
  },
  {
    path: 'shelters',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shelters/components/shelter-list/shelter-list').then(m => m.ShelterList)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/shelters/components/shelter-form/shelter-form').then(m => m.ShelterForm)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/shelters/components/shelter-form/shelter-form').then(m => m.ShelterForm)
      }
    ]
    // canActivate: [authGuard]  // Uncomment when authentication is implemented
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/users/components/user-list/user-list').then(m => m.UserList)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/users/components/user-form/user-form').then(m => m.UserForm)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/users/components/user-form/user-form').then(m => m.UserForm)
      }
    ]
    // canActivate: [authGuard, roleGuard],  // Uncomment when authentication is implemented
    // data: { roles: ['ADMIN', 'MANAGER', 'OWNER'] }
  },
  { path: '**', redirectTo: '/animals' }
];
