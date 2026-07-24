import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="glass-panel p-8 rounded-3xl shadow-2xl border border-slate-700/50 space-y-6">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-extrabold text-white tracking-tight">Password Reset</h2>
        <p class="text-sm text-slate-300">
          {{ step() === 1 ? 'Enter your email to receive a password reset link' : 'Enter verification code & new password' }}
        </p>
      </div>

      @if (step() === 1) {
        <form [formGroup]="requestForm" (ngSubmit)="onRequestReset()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="alex.rivera@example.com"
              class="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            [disabled]="requestForm.invalid || isLoading()"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            @if (isLoading()) {
              <span>Sending Code...</span>
            } @else {
              <span>Send Reset Code</span>
            }
          </button>
        </form>
      } @else {
        <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">6-Digit Code</label>
            <input
              type="text"
              formControlName="code"
              placeholder="123456"
              maxLength="6"
              class="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              formControlName="newPassword"
              placeholder="••••••••"
              class="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <button
            type="submit"
            [disabled]="resetForm.invalid || isLoading()"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <span>Update Password</span>
          </button>
        </form>
      }

      <div class="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Remembered your password?
        <a routerLink="/auth/login" class="text-emerald-400 font-bold hover:underline">Sign In</a>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private router = inject(Router);

  step = signal<number>(1);
  isLoading = signal<boolean>(false);

  requestForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  onRequestReset(): void {
    if (this.requestForm.invalid) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.step.set(2);
      this.notification.success('Reset Code Sent', 'Check your email for the 6-digit verification code.');
    }, 1000);
  }

  onResetPassword(): void {
    if (this.resetForm.invalid) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.notification.success('Password Updated', 'Your password has been updated. Please sign in.');
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
}
