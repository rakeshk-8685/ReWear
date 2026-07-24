import { Injectable, signal } from '@angular/core';

export interface ToastAlert {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  toasts = signal<ToastAlert[]>([]);

  show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string): void {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const toast: ToastAlert = { id, type, title, message };
    this.toasts.update((current) => [...current, toast]);

    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  error(title: string, message: string): void {
    this.show('error', title, message);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  dismiss(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
