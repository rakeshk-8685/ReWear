import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent, ImageFallbackDirective],
  template: `
    <div class="min-h-screen flex bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      <!-- Responsive Left Dark Sidebar Navbar -->
      <aside
        [class]="mobileNavOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1c2536] text-white p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 shadow-2xl lg:shadow-none"
      >
        <div class="space-y-8">
          <!-- Logo & Brand Header -->
          <a routerLink="/" class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              R
            </div>
            <div>
              <h3 class="font-extrabold text-lg leading-none text-white tracking-tight">ReWear Admin</h3>
            </div>
          </a>

          <!-- Navigation Links Stack -->
          <nav class="space-y-1.5">
            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'overview' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'overview' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">📊</span>
              <span>Overview</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'users' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'users' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">👥</span>
              <span>Users</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'listings' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'listings' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">🏷️</span>
              <span>Listings</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'swaps' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'swaps' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">🔄</span>
              <span>Swaps</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'reports' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'reports' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">🚩</span>
              <span>Reports</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'disputes' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'disputes' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">⚖️</span>
              <span>Disputes</span>
            </a>

            <a
              routerLink="/admin"
              [queryParams]="{ tab: 'settings' }"
              (click)="mobileNavOpen.set(false)"
              [class]="activeTab() === 'settings' ? 'bg-[#2a364f] text-white font-bold' : 'text-slate-400 hover:bg-[#2a364f]/60 hover:text-white'"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold"
            >
              <span class="text-base">⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>

        <!-- Sidebar Footer Admin User Card -->
        <div class="pt-6 border-t border-slate-700/60 flex items-center space-x-3">
          <img
            [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'"
            appImageFallback
            class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
          />
          <div class="truncate">
            <p class="text-xs font-bold truncate text-white">
              {{ authService.currentUser()?.name || 'Admin User' }}
            </p>
            <p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
              SUPER ADMIN
            </p>
          </div>
        </div>
      </aside>

      <!-- Main Body Area -->
      <div class="flex-1 flex flex-col min-w-0">
        
        <!-- Mobile Header Bar Toggle -->
        <div class="lg:hidden p-4 bg-[#1c2536] text-white flex items-center justify-between shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              R
            </div>
            <span class="font-bold text-sm">ReWear Admin</span>
          </div>
          <button
            (click)="mobileNavOpen.set(!mobileNavOpen())"
            class="p-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
          >
            {{ mobileNavOpen() ? '✕ Close' : '☰ Menu' }}
          </button>
        </div>

        <main class="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <router-outlet />
        </main>

      </div>

      <app-toast />
    </div>
  `,
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  
  mobileNavOpen = signal<boolean>(false);
  activeTab = signal<string>('overview');
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.activeTab.set(params['tab'] || 'overview');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
