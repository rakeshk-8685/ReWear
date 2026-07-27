import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unexpected error occurred.';
      
      if (error.status === 0) {
        errorMessage = 'Unable to reach ReWear API server. The backend service may be spinning up on Render or blocked by CORS.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request. Please check your input parameters.';
      } else if (error.status === 401) {
        errorMessage = error.error?.message || 'Invalid email or password.';
      } else if (error.status === 403) {
        errorMessage = error.error?.message || 'Access denied. You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'Requested API endpoint not found.';
      } else if (error.status === 503) {
        errorMessage = error.error?.message || 'Service temporarily unavailable. Database connection initializing.';
      } else if (error.status >= 500) {
        errorMessage = error.error?.message || 'Internal server error. Please try again later.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show notification for login failures or non-token-refresh errors
      if (error.status !== 401 || req.url.includes('/auth/login')) {
        const title = req.url.includes('/auth/login')
          ? error.status === 401
            ? 'Sign In Failed'
            : 'Authentication Error'
          : 'API Error';
        notificationService.error(title, errorMessage);
      }

      return throwError(() => error);
    })
  );
};
