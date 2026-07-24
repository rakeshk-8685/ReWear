import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account & Preferences</h1>
          <p class="text-sm text-slate-500">Manage your closet profile, location, and notification settings</p>
        </div>
        <a routerLink="/profile" class="text-xs font-bold text-slate-400 hover:text-slate-600">Back to Closet</a>
      </div>

      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="glass-card p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
        
        <!-- Profile Picture & Bio Section -->
        <div class="flex items-center space-x-6">
          <img
            [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
            class="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/30"
          />
          <div class="space-y-1">
            <h4 class="text-base font-bold text-slate-900 dark:text-white">{{ authService.currentUser()?.name }}</h4>
            <p class="text-xs text-slate-400">{{ authService.currentUser()?.email }}</p>
            <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
              {{ authService.userRole() }}
            </span>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
          <input
            type="text"
            formControlName="name"
            class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Public Bio</label>
          <textarea
            formControlName="bio"
            rows="3"
            class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          ></textarea>
        </div>

        <!-- Location City & Country -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">City</label>
            <input
              type="text"
              formControlName="city"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Country</label>
            <input
              type="text"
              formControlName="country"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        <!-- Theme Mode & Preferences -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Interface Theme Mode</h4>
            <p class="text-xs text-slate-400">Switch between Apple Light Mode and Dark Mode</p>
          </div>
          <button
            type="button"
            (click)="themeService.toggleTheme()"
            class="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            Current: {{ themeService.themeMode() | titlecase }}
          </button>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="settingsForm.invalid || isLoading()"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          @if (isLoading()) {
            <span>Saving Settings...</span>
          } @else {
            <span>Save Profile Preferences</span>
          }
        </button>

      </form>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private api = inject(ApiService);
  private notification = inject(NotificationService);

  isLoading = signal<boolean>(false);

  settingsForm = this.fb.group({
    name: ['', [Validators.required]],
    bio: [''],
    city: ['San Francisco'],
    country: ['USA'],
  });

  ngOnInit() {
    const u = this.authService.currentUser();
    if (u) {
      this.settingsForm.patchValue({
        name: u.name,
        bio: u.bio || '',
        city: u.location?.city || 'San Francisco',
        country: u.location?.country || 'USA',
      });
    }
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) return;

    this.isLoading.set(true);
    const { name, bio, city, country } = this.settingsForm.value;

    const payload = {
      name,
      bio,
      location: { city, country },
    };

    this.api.put<any>('/users/profile', payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.authService.updateCurrentUser(res.data);
          this.notification.success('Settings Saved', 'Your closet profile preferences have been updated.');
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
