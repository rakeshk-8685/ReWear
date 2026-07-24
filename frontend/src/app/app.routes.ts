import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Main Marketplace Layout Routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then((m) => m.LandingPageComponent),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./features/items/item-list/item-list.component').then((m) => m.ItemListComponent),
      },
      {
        path: 'items/create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/items/item-create/item-create.component').then((m) => m.ItemCreateComponent),
      },
      {
        path: 'items/:id',
        loadComponent: () =>
          import('./features/items/item-detail/item-detail.component').then((m) => m.ItemDetailComponent),
      },
      {
        path: 'swaps',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/swaps/swap-dashboard/swap-dashboard.component').then((m) => m.SwapDashboardComponent),
      },
      {
        path: 'chat',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/chat/chat-inbox/chat-inbox.component').then((m) => m.ChatInboxComponent),
      },
      {
        path: 'sustainability',
        loadComponent: () =>
          import('./features/sustainability/sustainability-dashboard/sustainability-dashboard.component').then(
            (m) => m.SustainabilityDashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-view/profile-view.component').then((m) => m.ProfileViewComponent),
      },
      {
        path: 'profile/settings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },

  // Auth Layout Routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./features/auth/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
      },
    ],
  },

  // Admin Dashboard Layout Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN', 'MODERATOR'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
