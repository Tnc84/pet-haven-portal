import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/animals', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/components/register/register').then(m => m.Register)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/error/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/error/not-found/not-found').then(m => m.NotFoundComponent)
  },
  {
    path: 'animals',
    canActivate: [authGuard],
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
  },
  {
    path: 'shelters',
    canActivate: [authGuard],
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
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'MANAGER', 'OWNER'] },
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
  },
  { path: '**', redirectTo: '/animals' }
];
