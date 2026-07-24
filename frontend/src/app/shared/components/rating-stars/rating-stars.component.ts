import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-1">
      @for (star of stars; track $index) {
        <button
          type="button"
          [disabled]="readonly"
          (click)="onSelect($index + 1)"
          class="focus:outline-none transition-transform hover:scale-125"
          [ngClass]="{ 'cursor-default': readonly, 'cursor-pointer': !readonly }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            [ngClass]="{
              'text-amber-400 fill-amber-400': $index < rating,
              'text-slate-300 dark:text-slate-700': $index >= rating
            }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      }
      @if (showNumber) {
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5">{{ rating.toFixed(1) }}</span>
      }
    </div>
  `,
})
export class RatingStarsComponent {
  @Input() rating = 5;
  @Input() readonly = true;
  @Input() showNumber = true;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  onSelect(num: number): void {
    if (!this.readonly) {
      this.rating = num;
      this.ratingChange.emit(num);
    }
  }
}
