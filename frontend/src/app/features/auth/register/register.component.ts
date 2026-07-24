import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="glass-panel p-8 rounded-3xl shadow-2xl border border-slate-700/50 space-y-6">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-extrabold text-white tracking-tight">Join ReWear</h2>
        <p class="text-sm text-slate-300">Start swapping pre-loved sustainable fashion today</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="regName" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
          <input
            id="regName"
            name="name"
            type="text"
            autocomplete="name"
            formControlName="name"
            placeholder="Alex Rivera"
            class="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>

        <div>
          <label for="regEmail" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
          <input
            id="regEmail"
            name="email"
            type="email"
            autocomplete="username"
            formControlName="email"
            placeholder="alex.rivera@example.com"
            class="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>

        <div>
          <label for="regPassword" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Password</label>
          <div class="relative">
            <input
              id="regPassword"
              name="password"
              [type]="showPassword() ? 'text' : 'password'"
              autocomplete="new-password"
              formControlName="password"
              (input)="onPasswordInput()"
              placeholder="At least 6 characters"
              class="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all pr-10"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {{ showPassword() ? '🙈' : '👁️' }}
            </button>
          </div>

          <!-- Password Strength Meter Bar -->
          @if (registerForm.get('password')?.value) {
            <div class="mt-2 space-y-1">
              <div class="flex items-center justify-between text-[11px] font-bold">
                <span class="text-slate-400">Password Strength:</span>
                <span [ngClass]="strengthColorClass">{{ strengthLabel }}</span>
              </div>
              <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  [style.width.%]="strengthScore * 25"
                  [ngClass]="strengthBarClass"
                ></div>
              </div>
            </div>
          }
        </div>

        <div>
          <label for="regRole" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Account Type</label>
          <select
            id="regRole"
            name="role"
            formControlName="role"
            class="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="USER">Standard Swapper</option>
            <option value="ADMIN">Platform Admin (Demo)</option>
          </select>
        </div>

        <button
          type="submit"
          [disabled]="registerForm.invalid || isLoading()"
          class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          @if (isLoading()) {
            <span>Creating Account...</span>
          } @else {
            <span>Create ReWear Account</span>
          }
        </button>
      </form>

      <div class="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Already have an account?
        <a routerLink="/auth/login" class="text-emerald-400 font-bold hover:underline">Sign In</a>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  strengthScore = 0;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER'],
  });

  onPasswordInput(): void {
    const val = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;
    this.strengthScore = score;
  }

  get strengthLabel(): string {
    if (this.strengthScore <= 1) return 'Weak';
    if (this.strengthScore === 2) return 'Fair';
    if (this.strengthScore === 3) return 'Good';
    return 'Strong';
  }

  get strengthColorClass(): string {
    if (this.strengthScore <= 1) return 'text-rose-400';
    if (this.strengthScore === 2) return 'text-amber-400';
    if (this.strengthScore === 3) return 'text-cyan-400';
    return 'text-emerald-400';
  }

  get strengthBarClass(): string {
    if (this.strengthScore <= 1) return 'bg-rose-500';
    if (this.strengthScore === 2) return 'bg-amber-500';
    if (this.strengthScore === 3) return 'bg-cyan-500';
    return 'bg-emerald-500';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.notification.success('Welcome to ReWear', 'Account created successfully!');
          this.router.navigate(['/auth/verify-email']);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
