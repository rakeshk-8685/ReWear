import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'card' || type === 'marketplace') {
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (item of items; track $index) {
          <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
            <div class="w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div class="space-y-2">
              <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              <div class="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          </div>
        }
      </div>
    } @else if (type === 'dashboard') {
      <div class="space-y-8 animate-pulse">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (item of [1, 2, 3, 4]; track item) {
            <div class="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800/80"></div>
          }
        </div>
        <div class="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/80"></div>
      </div>
    } @else if (type === 'table') {
      <div class="space-y-4 animate-pulse">
        @for (item of items; track $index) {
          <div class="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800/80"></div>
        }
      </div>
    } @else if (type === 'profile') {
      <div class="p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 animate-pulse">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div class="space-y-2 flex-1">
            <div class="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-3 w-60 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
        <div class="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
      </div>
    } @else if (type === 'chat') {
      <div class="space-y-4 animate-pulse p-4">
        @for (item of [1, 2, 3, 4]; track item; let idx = $index) {
          <div [class]="idx % 2 === 0 ? 'flex justify-start' : 'flex justify-end'">
            <div [class]="idx % 2 === 0 ? 'w-2/3 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800' : 'w-1/2 h-12 rounded-2xl bg-emerald-500/20'"></div>
          </div>
        }
      </div>
    } @else {
      <div class="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
    }
  `,
})
export class SkeletonLoaderComponent {
  @Input() count = 8;
  @Input() type: 'card' | 'marketplace' | 'dashboard' | 'table' | 'profile' | 'chat' | 'image' = 'card';

  get items(): number[] {
    return Array(this.count).fill(0);
  }
}
