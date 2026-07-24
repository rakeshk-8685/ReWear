import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto p-4 rounded-2xl glass-panel shadow-2xl border flex items-start space-x-3 transition-all transform animate-bounce-short"
          [ngClass]="{
            'border-emerald-500/50 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100': toast.type === 'success',
            'border-rose-500/50 bg-rose-50/90 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100': toast.type === 'error',
            'border-sky-500/50 bg-sky-50/90 dark:bg-sky-950/90 text-sky-900 dark:text-sky-100': toast.type === 'info',
            'border-amber-500/50 bg-amber-50/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100': toast.type === 'warning'
          }"
        >
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <div class="flex-1">
            <h5 class="text-sm font-bold">{{ toast.title }}</h5>
            <p class="text-xs mt-0.5 leading-relaxed opacity-90">{{ toast.message }}</p>
          </div>

          <button (click)="notificationService.dismiss(toast.id)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
