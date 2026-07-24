import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../../../core/models/item.model';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ItemService, DEFAULT_ITEM_IMAGE, DEFAULT_USER_AVATAR } from '../../../core/services/item.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuickPreviewService } from '../../../core/services/quick-preview.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  template: `
    <div class="group relative glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
      
      <!-- Image Container (Clicking opens garment detail page) -->
      <a [routerLink]="['/items', item?._id || 'item']" class="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer block">
        <img
          [src]="item?.images?.[0] || defaultItemImage"
          [alt]="item?.title || 'Clothing Item'"
          appImageFallback
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <!-- Top Badges Overlay -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div class="flex items-center space-x-1.5">
            <span class="px-3 py-1 text-[10px] font-extrabold rounded-full bg-slate-900/80 dark:bg-white/80 text-white dark:text-slate-900 backdrop-blur-md shadow-md uppercase tracking-wider">
              {{ item?.condition || 'Like New' }}
            </span>
            <span class="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              🌱 CO2 Rescued
            </span>
          </div>

          <!-- Like / Favorite Heart Toggle Button -->
          <button
            (click)="toggleFavorite($event)"
            class="pointer-events-auto w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md hover:scale-110 active:scale-95 transition-all"
            [title]="isLiked ? 'Remove from Favorites' : 'Add to Favorites'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-all"
              [ngClass]="{ 'text-rose-500 fill-rose-500 scale-110': isLiked, 'text-slate-600 dark:text-slate-300': !isLiked }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-4.5-4.5h-1.586a1.5 1.5 0 01-1.06-.44l-1.414-1.414a1.5 1.5 0 00-2.12 0L7.586 6.318a1.5 1.5 0 01-1.06.44H4.318z" />
            </svg>
          </button>
        </div>

        <!-- Quick View Floating Button Hover Overlay -->
        <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            type="button"
            (click)="triggerQuickPreview($event)"
            class="pointer-events-auto px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white font-bold text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-1"
          >
            <span>🔍 Quick View</span>
          </button>
        </div>

        <!-- Size, Value & Location Overlay Badges -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div class="flex items-center space-x-1.5">
            <span class="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-emerald-500 text-white shadow-md">
              Size: {{ item?.size || 'M' }}
            </span>
            <span class="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-slate-900/70 text-slate-200 backdrop-blur-sm">
              Est. ~&#36;{{ item?.valueEstimate || 50 }}
            </span>
          </div>
          @if (item?.location) {
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-900/80 text-slate-200 backdrop-blur-md truncate max-w-[110px]">
              📍 {{ item.location }}
            </span>
          }
        </div>
      </a>

      <!-- Card Body Info -->
      <div class="p-5 flex flex-col flex-1 justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span class="font-bold text-slate-700 dark:text-slate-300">{{ item?.brand || 'Pre-Loved' }}</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px] tracking-wider">{{ item?.category || 'Tops' }}</span>
          </div>

          <a [routerLink]="['/items', item?._id || 'item']" class="block">
            <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ item?.title || 'Clothing Garment' }}
            </h3>
          </a>

          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {{ item?.description || 'Pre-loved clothing available for swap.' }}
          </p>
        </div>

        <!-- Swapper Profile Pill with Verified Badge & Propose Swap Button -->
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img
              [src]="item?.owner?.avatarUrl || defaultUserAvatar"
              [alt]="item?.owner?.name || 'Verified Swapper'"
              appImageFallback
              class="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/40"
            />
            <div class="flex items-center space-x-1">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[85px]">
                {{ item?.owner?.name || 'Verified Swapper' }}
              </span>
              <span class="text-emerald-500 text-[11px]" title="Verified Swapper">✓</span>
            </div>
          </div>

          <a
            [routerLink]="['/items', item?._id || 'item']"
            class="px-3.5 py-1.5 rounded-full btn-primary text-xs flex items-center space-x-1 shadow-sm"
          >
            <span>Swap</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  `,
})
export class ItemCardComponent implements OnInit {
  @Input({ required: true }) item!: Item;
  @Output() favoriteToggled = new EventEmitter<boolean>();
  @Output() quickPreview = new EventEmitter<Item>();

  private itemService = inject(ItemService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private quickPreviewService = inject(QuickPreviewService);

  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;
  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;

  isLiked = false;

  ngOnInit() {
    const currentUserId = this.authService.currentUser()?._id;
    if (currentUserId && this.item?.likedBy) {
      this.isLiked = this.item.likedBy.includes(currentUserId);
    }
  }

  triggerQuickPreview(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.item) {
      this.quickPreviewService.open(this.item);
      this.quickPreview.emit(this.item);
    }
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isAuthenticated()) {
      this.notification.info('Sign In Required', 'Please sign in to save items to your favorites.');
      return;
    }

    if (!this.item?._id) return;

    this.isLiked = !this.isLiked;

    if (this.item._id.startsWith('demo-')) {
      this.favoriteToggled.emit(this.isLiked);
      this.notification.success(
        this.isLiked ? 'Added to Favorites' : 'Removed from Favorites',
        `"${this.item.title}" updated in your favorites.`
      );
      return;
    }

    this.itemService.toggleLike(this.item._id).subscribe({
      next: (res) => {
        if (res.data) {
          this.isLiked = res.data.liked;
          this.favoriteToggled.emit(this.isLiked);
          this.notification.success(
            this.isLiked ? 'Added to Favorites' : 'Removed from Favorites',
            `"${this.item?.title}" updated in your favorites.`
          );
        }
      },
      error: () => {
        this.isLiked = !this.isLiked;
        this.notification.error('Error', 'Could not update item favorites. Please try again.');
      },
    });
  }
}
