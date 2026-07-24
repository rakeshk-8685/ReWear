import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="min-h-screen flex bg-slate-900 text-slate-100">
      
      <!-- Sidebar -->
      <aside class="w-64 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div class="space-y-8">
          <a routerLink="/" class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
              R
            </div>
            <div>
              <h3 class="font-bold text-lg leading-none">ReWear</h3>
              <span class="text-[10px] uppercase font-bold text-emerald-400">Admin Control</span>
            </div>
          </a>

          <nav class="space-y-2">
            <a
              routerLink="/admin"
              [routerLinkActiveOptions]="{ exact: true }"
              routerLinkActive="bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 font-bold"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Platform KPI Stats</span>
            </a>

            <a
              routerLink="/"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Exit to Marketplace</span>
            </a>
          </nav>
        </div>

        <div class="pt-6 border-t border-slate-800 flex items-center space-x-3">
          <img [src]="authService.currentUser()?.avatarUrl" class="w-10 h-10 rounded-full object-cover" />
          <div class="truncate">
            <p class="text-sm font-bold truncate">{{ authService.currentUser()?.name }}</p>
            <p class="text-xs text-emerald-400 uppercase font-semibold">{{ authService.userRole() }}</p>
          </div>
        </div>
      </aside>

      <!-- Main Body -->
      <main class="flex-1 p-8 overflow-y-auto">
        <router-outlet />
      </main>

      <app-toast />
    </div>
  `,
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
}
