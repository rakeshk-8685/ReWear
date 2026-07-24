import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-panel p-8 rounded-3xl shadow-2xl border border-slate-700/50 space-y-6 text-center">
      
      @if (verified()) {
        <!-- Success State Animation -->
        <div class="space-y-4 animate-spring-popup">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-white">Email Verified!</h2>
          <p class="text-sm text-slate-300">Your ReWear account is now fully active. Redirecting to clothing marketplace...</p>
        </div>
      } @else {
        <div class="space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">Verify Your Email</h2>
          <p class="text-xs text-slate-300">Enter the 6-digit verification code sent to your inbox</p>
        </div>

        <form [formGroup]="otpForm" (ngSubmit)="onVerify()" class="space-y-5">
          <div>
            <input
              type="text"
              formControlName="code"
              maxLength="6"
              placeholder="123456"
              class="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white text-center font-mono tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            [disabled]="otpForm.invalid || isLoading()"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            @if (isLoading()) {
              <span>Verifying Code...</span>
            } @else {
              <span>Verify & Continue</span>
            }
          </button>
        </form>

        <!-- Resend Code Timer -->
        <div class="pt-2 border-t border-slate-800 text-xs text-slate-400">
          Didn't receive the email?
          @if (resendTimer() > 0) {
            <span class="text-emerald-400 font-bold ml-1">Resend in {{ resendTimer() }}s</span>
          } @else {
            <button (click)="resendCode()" class="text-emerald-400 font-bold hover:underline ml-1">
              Resend Code Now
            </button>
          }
        </div>
      }

    </div>
  `,
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private router = inject(Router);

  verified = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  resendTimer = signal<number>(30);

  private timerInterval?: any;

  otpForm = this.fb.group({
    code: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      if (this.resendTimer() > 0) {
        this.resendTimer.update((t) => t - 1);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  resendCode(): void {
    this.resendTimer.set(30);
    this.notification.info('Verification Code Sent', 'A new 6-digit OTP code has been sent to your email.');
  }

  onVerify(): void {
    if (this.otpForm.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.verified.set(true);
      this.notification.success('Email Verified', 'Welcome to ReWear!');
      setTimeout(() => {
        this.router.navigate(['/items']);
      }, 1500);
    }, 1000);
  }
}
