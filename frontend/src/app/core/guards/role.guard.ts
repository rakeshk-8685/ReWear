import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    const userRole = authService.userRole();
    if (authService.isAuthenticated() && allowedRoles.includes(userRole)) {
      return true;
    }

    notification.error('Access Denied', 'You do not have permission to view this restricted page.');
    router.navigate(['/']);
    return false;
  };
};
