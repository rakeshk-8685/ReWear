import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="glass-card p-12 rounded-4xl border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl max-w-lg mx-auto animate-spring-popup">
      <!-- Icon Glow Orb -->
      <div class="w-20 h-20 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-4xl shadow-inner">
        {{ icon }}
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ title }}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{{ description }}</p>
      </div>

      @if (actionText && actionLink) {
        <div class="pt-2">
          <a
            [routerLink]="actionLink"
            class="inline-flex items-center space-x-2 px-6 py-3 rounded-full btn-primary text-xs shadow-md"
          >
            <span>{{ actionText }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'No Items Found';
  @Input() description = 'Explore the marketplace or adjust your search filters.';
  @Input() icon = '🧥';
  @Input() actionText = 'Explore Marketplace';
  @Input() actionLink = '/items';
}
