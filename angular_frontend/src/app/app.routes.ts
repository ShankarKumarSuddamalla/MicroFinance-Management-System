import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients/new',
    loadComponent: () => import('./features/client-edit/client-edit.component').then(m => m.ClientEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients/edit/:clientNumber',
    loadComponent: () => import('./features/client-edit/client-edit.component').then(m => m.ClientEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
