import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title || 'Modal Dialog'"
      >
        <div
          class="w-full sm:max-w-xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-sheet-up max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <!-- iOS Touch Grab Handle Indicator -->
          <div class="sheet-grab-handle sm:hidden"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{{ title }}</h3>
              @if (subtitle) {
                <p class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
              }
            </div>
            <button
              (click)="close.emit()"
              class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
              aria-label="Close Dialog"
            >
              ✕
            </button>
          </div>

          <!-- Content Body Projection -->
          <div class="py-2">
            <ng-content />
          </div>

        </div>
      </div>
    }
  `,
})
export class BottomSheetComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Output() close = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  onEsc() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }
}
