import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unexpected error occurred.';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show notification for login failures or non-token-refresh 401s
      if (error.status !== 401 || req.url.includes('/auth/login')) {
        notificationService.error(
          req.url.includes('/auth/login') ? 'Authentication Failed' : 'Request Failed',
          errorMessage
        );
      }

      return throwError(() => error);
    })
  );
};
