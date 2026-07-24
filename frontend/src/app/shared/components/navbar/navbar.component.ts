import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Floating Luxury Glass Navbar Container -->
    <header class="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none transition-all duration-300">
      <div
        [class]="scrolled()
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border-slate-300/80 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.12)] scale-[0.99]'
          : 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border-slate-200/70 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.06)]'"
        class="pointer-events-auto relative flex items-center justify-between px-4 py-2.5 rounded-[28px] border transition-all duration-300"
      >
        
        <!-- ═══ FAR LEFT: Luxury Brand Logo ═══ -->
        <a routerLink="/" class="flex items-center space-x-2.5 group">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all duration-300">
            <span>R</span>
          </div>
          <div class="flex flex-col">
            <span class="font-black text-lg tracking-tighter leading-none text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">ReWear</span>
            <span class="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Marketplace</span>
          </div>
        </a>

        <!-- ═══ CENTER: Floating Navigation Pill (Desktop/Tablet) ═══ -->
        <nav class="hidden md:flex items-center space-x-1 p-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md shadow-inner">
          <a
            routerLink="/"
            routerLinkActive="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold shadow-sm scale-[1.02]"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-200"
          >
            Explore
          </a>

          <a
            routerLink="/items"
            routerLinkActive="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold shadow-sm scale-[1.02]"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-200"
          >
            Marketplace
          </a>

          <a
            routerLink="/swaps"
            routerLinkActive="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold shadow-sm scale-[1.02]"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-200"
          >
            Swap
          </a>

          <a
            routerLink="/sustainability"
            routerLinkActive="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold shadow-sm scale-[1.02]"
            class="px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-200"
          >
            Eco Impact
          </a>
        </nav>

        <!-- ═══ RIGHT SECTION: Actions, Search, Wishlist, Profile & CTA ═══ -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          
          <!-- Search Icon Button -->
          <a
            routerLink="/items"
            class="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Search Marketplace"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </a>

          <!-- Wishlist / Favorites Icon Button -->
          <a
            routerLink="/items"
            [queryParams]="{ favorite: 'true' }"
            class="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Favorites & Saved Items"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-4.5-4.5h-1.586a1.5 1.5 0 01-1.06-.44l-1.414-1.414a1.5 1.5 0 00-2.12 0L7.586 6.318a1.5 1.5 0 01-1.06.44H4.318z" />
            </svg>
          </a>

          <!-- Notification Bell Trigger & Dropdown -->
          @if (authService.isAuthenticated()) {
            <div class="relative">
              <button
                type="button"
                (click)="notifOpen.set(!notifOpen()); menuOpen.set(false)"
                class="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 relative"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                @if (unreadNotifs() > 0) {
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                }
              </button>

              <!-- Notifications Dropdown Card -->
              @if (notifOpen()) {
                <div class="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-spring-popup space-y-3">
                  <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 class="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">Notifications</h4>
                    <button (click)="unreadNotifs.set(0)" class="text-[10px] font-bold text-emerald-500 hover:underline">
                      Mark all read
                    </button>
                  </div>

                  <div class="space-y-2 max-h-72 overflow-y-auto scrollbar-none">
                    <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase text-emerald-400">Trade Proposal</span>
                        <span class="text-[9px] text-slate-400">10m ago</span>
                      </div>
                      <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Aarav Sharma offered Nike Sports Hoodie for your Levi's 501 Jeans.</p>
                    </div>

                    <div class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase text-slate-400">Direct Message</span>
                        <span class="text-[9px] text-slate-400">2h ago</span>
                      </div>
                      <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Rohan Gupta sent you a message regarding courier pickup.</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Theme Mode Switcher -->
          <button
            type="button"
            (click)="themeService.toggleTheme()"
            class="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 text-xs"
            aria-label="Toggle Theme"
          >
            {{ themeService.themeMode() === 'dark' ? '☀️' : '🌙' }}
          </button>

          <!-- Premium CTA Button ("+ New Listing") -->
          <a
            routerLink="/items/create"
            class="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-xs font-black shadow-md hover:shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all duration-300 min-h-[36px] relative overflow-hidden group"
          >
            <span class="relative z-10">+ New Listing</span>
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          </a>

          <!-- Profile Avatar & Unified Menu Dropdown -->
          @if (authService.isAuthenticated()) {
            <div class="relative">
              <button
                type="button"
                (click)="menuOpen.set(!menuOpen()); notifOpen.set(false)"
                class="flex items-center space-x-1 p-0.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-200"
              >
                <img
                  [src]="authService.currentUser()?.avatarUrl || defaultUserAvatar"
                  class="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 hover:scale-105 transition-transform"
                />
              </button>

              <!-- Unified Profile Dropdown (Dashboard, Settings, Trade Center, Profile, Logout, Admin) -->
              @if (menuOpen()) {
                <div class="absolute right-0 mt-3 w-56 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl py-2 z-50 text-xs font-bold animate-spring-popup space-y-0.5">
                  
                  <div class="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center space-x-1.5">
                      <p class="text-slate-900 dark:text-white truncate font-extrabold">{{ authService.currentUser()?.name }}</p>
                      <span class="text-emerald-500 text-[10px]">✓</span>
                    </div>
                    <p class="text-[10px] text-slate-400 font-normal truncate mt-0.5">{{ authService.currentUser()?.email }}</p>
                  </div>

                  <a routerLink="/dashboard" (click)="menuOpen.set(false)" class="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <span class="text-sm">📊</span>
                    <span>Dashboard</span>
                  </a>

                  <a routerLink="/swaps" (click)="menuOpen.set(false)" class="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <span class="text-sm">⇄</span>
                    <span>Trade Center</span>
                  </a>

                  <a routerLink="/profile" (click)="menuOpen.set(false)" class="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <span class="text-sm">👔</span>
                    <span>My Closet Profile</span>
                  </a>

                  <a routerLink="/profile/settings" (click)="menuOpen.set(false)" class="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <span class="text-sm">⚙️</span>
                    <span>Account Settings</span>
                  </a>

                  @if (authService.isAdmin()) {
                    <a routerLink="/admin" (click)="menuOpen.set(false)" class="flex items-center space-x-2.5 px-4 py-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                      <span class="text-sm">🛡️</span>
                      <span>Admin Management</span>
                    </a>
                  }

                  <div class="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>

                  <button
                    type="button"
                    (click)="handleLogout()"
                    class="w-full text-left flex items-center space-x-2.5 px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <span class="text-sm">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login" class="text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:text-emerald-500 px-3 py-1.5">
              Sign In
            </a>
            <a routerLink="/auth/register" class="px-4 py-2 rounded-full btn-primary text-xs shadow-sm">
              Join Free
            </a>
          }

          <!-- Mobile Hamburger Drawer Trigger -->
          <button
            type="button"
            (click)="mobileDrawerOpen.set(!mobileDrawerOpen())"
            class="md:hidden w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all"
            aria-label="Toggle Mobile Drawer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>

      </div>

      <!-- Mobile Slide-Out Drawer Overlay (Mobile & Tablet) -->
      @if (mobileDrawerOpen()) {
        <div (click)="mobileDrawerOpen.set(false)" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex justify-end md:hidden animate-fade-in pointer-events-auto">
          <div (click)="$event.stopPropagation()" class="w-72 bg-white dark:bg-slate-900 h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            <div class="space-y-6">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center">R</div>
                  <span class="font-black text-sm text-slate-900 dark:text-white">ReWear Menu</span>
                </div>
                <button (click)="mobileDrawerOpen.set(false)" class="text-slate-400 font-bold text-lg">✕</button>
              </div>

              <nav class="space-y-2">
                <a routerLink="/" (click)="mobileDrawerOpen.set(false)" class="block px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  🏠 Explore Home
                </a>
                <a routerLink="/items" (click)="mobileDrawerOpen.set(false)" class="block px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  🛍️ Marketplace Feed
                </a>
                <a routerLink="/swaps" (click)="mobileDrawerOpen.set(false)" class="block px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  ⇄ Swap Trades
                </a>
                <a routerLink="/sustainability" (click)="mobileDrawerOpen.set(false)" class="block px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  🌱 Eco Impact
                </a>
              </nav>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <a routerLink="/items/create" (click)="mobileDrawerOpen.set(false)" class="w-full py-3 rounded-full btn-primary text-xs font-black text-center block shadow-md">
                + New Garment Listing
              </a>
            </div>
          </div>
        </div>
      }
    </header>

    <!-- Native Mobile Floating Bottom Navigation Bar (Explore, Swap, Messages, Profile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl pointer-events-auto">
      <a routerLink="/" routerLinkActive="text-emerald-500" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
        <span class="text-base">🏠</span>
        <span>Explore</span>
      </a>
      <a routerLink="/items" routerLinkActive="text-emerald-500" class="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
        <span class="text-base">🛍️</span>
        <span>Feed</span>
      </a>
      @if (authService.isAuthenticated()) {
        <a routerLink="/items/create" class="flex flex-col items-center justify-center w-11 h-11 rounded-full btn-primary text-white text-xl shadow-lg -translate-y-2">
          <span>+</span>
        </a>
        <a routerLink="/swaps" routerLinkActive="text-emerald-500" class="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
          <span class="text-base">⇄</span>
          <span>Swap</span>
        </a>
        <a routerLink="/profile" routerLinkActive="text-emerald-500" class="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
          <span class="text-base">👤</span>
          <span>Profile</span>
        </a>
      } @else {
        <a routerLink="/auth/login" class="flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
          <span class="text-base">🔑</span>
          <span>Sign In</span>
        </a>
      }
    </nav>
  `,
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  menuOpen = signal<boolean>(false);
  notifOpen = signal<boolean>(false);
  mobileDrawerOpen = signal<boolean>(false);
  scrolled = signal<boolean>(false);
  unreadNotifs = signal<number>(2);

  readonly defaultUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  handleLogout(): void {
    this.menuOpen.set(false);
    this.notifOpen.set(false);
    this.mobileDrawerOpen.set(false);
    this.authService.logout();
  }
}
