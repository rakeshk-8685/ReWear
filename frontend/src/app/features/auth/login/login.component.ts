import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 max-w-6xl mx-auto py-4 lg:py-0 min-h-[80vh]">
      
      <!-- Left 58% Hero & Emotional Brand Experience -->
      <div class="w-full lg:w-[56%] space-y-5 relative overflow-hidden">
        <div class="space-y-3 relative z-10">
          <span class="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block shadow-sm">
            🌱 Zero-Waste Circular Fashion Exchange
          </span>
          <h1 class="text-3xl sm:text-5xl lg:text-[3.4rem] font-black text-white tracking-tight leading-[1.05]">
            Swap Fashion, <br />
            <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">Not the Planet.</span>
          </h1>
          <p class="text-sm text-slate-300 leading-relaxed max-w-lg">
            Join 18,500+ conscious swappers in Bangalore, Mumbai, Delhi & Noida trading pre-loved jackets, denim, sneakers, and vintage apparel with zero dollar transactions.
          </p>
        </div>

        <!-- Live Impact Telemetry Stats Grid -->
        <div class="grid grid-cols-3 gap-3 relative z-10">
          <div class="glass-card p-3 rounded-2xl text-center space-y-0.5 bg-slate-900/60 border border-slate-800 animate-float-slow">
            <span class="block text-lg font-black text-white">8,920+</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">Garments Swapped</span>
          </div>
          <div class="glass-card p-3 rounded-2xl text-center space-y-0.5 bg-slate-900/60 border border-slate-800 animate-float-delayed">
            <span class="block text-lg font-black text-emerald-400">14.2 Tons</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">CO₂ Saved</span>
          </div>
          <div class="glass-card p-3 rounded-2xl text-center space-y-0.5 bg-slate-900/60 border border-slate-800 animate-float-slow">
            <span class="block text-lg font-black text-blue-400">18.5k</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">Active Swappers</span>
          </div>
        </div>

        <!-- Floating Fashion Photography Showcase Cards -->
        <div class="grid grid-cols-2 gap-3 relative z-10">
          <div class="p-3 rounded-2xl glass-card bg-slate-900/60 border border-slate-800 flex items-center space-x-3 shadow-xl hover:scale-[1.03] transition-all animate-float-slow">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200" class="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/30" />
            <div class="truncate">
              <span class="text-[9px] font-bold uppercase text-emerald-400">📍 Bangalore</span>
              <h4 class="text-xs font-bold text-white truncate">Nike Sports Hoodie</h4>
              <p class="text-[10px] text-slate-400">Like New • Size L</p>
            </div>
          </div>

          <div class="p-3 rounded-2xl glass-card bg-slate-900/60 border border-slate-800 flex items-center space-x-3 shadow-xl hover:scale-[1.03] transition-all animate-float-delayed">
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200" class="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/30" />
            <div class="truncate">
              <span class="text-[9px] font-bold uppercase text-emerald-400">📍 Mumbai</span>
              <h4 class="text-xs font-bold text-white truncate">Levi's 501 Jeans</h4>
              <p class="text-[10px] text-slate-400">Pristine • 32x32</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 42% Glassmorphism Authentication Form Card -->
      <div class="w-full lg:w-[42%] lg:max-w-[420px]">
        <div class="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/90 p-6 sm:p-7 rounded-[28px] border border-white/20 dark:border-slate-800 shadow-2xl shadow-emerald-500/10 space-y-5 animate-spring-popup">
          
          <div class="text-center space-y-1.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              R
            </div>
            <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back to ReWear</h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Sign in to manage your clothing swaps and messages</p>
          </div>

          <!-- Official Vector Social Auth Buttons -->
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              (click)="socialLogin('Google')"
              class="py-2.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              (click)="socialLogin('Apple')"
              class="py-2.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <svg class="w-4 h-4 flex-shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.18c.67-.82 1.12-1.97.99-3.12-1 .04-2.18.67-2.88 1.48-.63.73-1.18 1.9-1.03 3.03 1.12.09 2.25-.56 2.92-1.39z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center space-x-3">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">or continue with email</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <!-- Quick Demo Login Presets -->
          <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Quick Demo Presets</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                (click)="fillDemo('alex@rewear.com', 'password123')"
                class="py-1.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
              >
                👤 User Demo
              </button>
              <button
                type="button"
                (click)="fillDemo('admin@rewear.com', 'password123')"
                class="py-1.5 px-3 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-500/30 transition-colors border border-purple-500/30"
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-3.5">
            <div>
              <label for="loginEmail" class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <input
                id="loginEmail"
                name="email"
                type="email"
                autocomplete="username"
                formControlName="email"
                placeholder="alex.rivera&#64;example.com"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs transition-all"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="loginPassword" class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Password</label>
                <a routerLink="/auth/forgot-password" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Forgot?</a>
              </div>
              <div class="relative">
                <input
                  id="loginPassword"
                  name="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  autocomplete="current-password"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs transition-all pr-10"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
                >
                  {{ showPassword() ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                formControlName="rememberMe"
                class="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
              />
              <label for="rememberMe" class="text-[11px] text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full py-3 rounded-full btn-primary shine-button text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              @if (isLoading()) {
                <span>Signing In...</span>
              } @else {
                <span>Sign In to ReWear</span>
              }
            </button>
          </form>

          <div class="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>Don't have a ReWear account? <a routerLink="/auth/register" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Create Account</a></p>
            <p class="text-[9px] text-slate-400">🔒 256-bit SSL Encrypted • Zero Dollar Transactions</p>
          </div>

        </div>
      </div>

    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['alex@rewear.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required]],
    rememberMe: [true],
  });

  fillDemo(email: string, pass: string): void {
    this.loginForm.patchValue({ email, password: pass });
  }

  socialLogin(provider: string): void {
    this.notification.info('Social Auth', `${provider} OAuth sign-in initialized.`);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password }, rememberMe ?? true).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.notification.success('Welcome Back', `Logged in as ${res.data?.user.name}`);
          this.router.navigate(['/items']);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
