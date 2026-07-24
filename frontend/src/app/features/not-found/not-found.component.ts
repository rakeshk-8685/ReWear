import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <!-- 404 Glass Graphics -->
      <div class="relative">
        <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-500/20 flex items-center justify-center animate-pulse-subtle">
          <span class="text-6xl font-black text-emerald-500">404</span>
        </div>
      </div>

      <div class="space-y-2 max-w-md">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Garment Page Not Found</h1>
        <p class="text-sm text-slate-500 leading-relaxed">
          The clothing item or marketplace page you are looking for has been moved, swapped, or doesn't exist.
        </p>
      </div>

      <div class="flex items-center space-x-4 pt-2">
        <a
          routerLink="/items"
          class="px-6 py-3.5 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          Explore Clothing Marketplace
        </a>
        <a
          routerLink="/"
          class="px-6 py-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
        >
          Return Home
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
