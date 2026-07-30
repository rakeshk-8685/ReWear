import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuickPreviewService } from '../../../core/services/quick-preview.service';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { DEFAULT_ITEM_IMAGE, DEFAULT_USER_AVATAR } from '../../../core/services/item.service';

@Component({
  selector: 'app-quick-preview-modal',
  standalone: true,
  imports: [CommonModule, ImageFallbackDirective],
  template: `
    @if (quickPreviewService.isOpen() && quickPreviewService.previewItem()) {
      <div
        class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 animate-backdrop-fade-in"
        style="background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%);"
        (click)="quickPreviewService.close()"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="'Quick Preview: ' + (quickPreviewService.previewItem()?.title || 'Garment')"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto animate-modal-scale-in
                 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl
                 rounded-t-[32px] md:rounded-[32px]
                 border border-slate-200/60 dark:border-white/[0.08]
                 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)]"
          (click)="$event.stopPropagation()"
        >
          <!-- Mobile iOS Grab Bar -->
          <div class="flex justify-center pt-3 md:hidden">
            <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>

          <!-- Close Modal Button -->
          <button
            type="button"
            (click)="quickPreviewService.close()"
            class="modal-close-btn absolute top-4 right-4 z-20 w-9 h-9 rounded-full
                   bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md
                   text-slate-500 dark:text-slate-400
                   hover:bg-slate-200 dark:hover:bg-slate-700
                   hover:text-slate-900 dark:hover:text-white
                   flex items-center justify-center shadow-md transition-all"
            aria-label="Close Preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Modal Split Layout -->
          <div class="flex flex-col md:flex-row">

            <!-- ═══ LEFT COLUMN: Image Gallery ═══ -->
            <div class="md:w-[440px] lg:w-[480px] shrink-0 p-5 md:p-7">
              <!-- Main Product Image -->
              <div class="preview-img-zoom rounded-[22px] aspect-[4/5] bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner relative">
                <img
                  [src]="selectedImage"
                  [alt]="item?.title || 'Garment'"
                  appImageFallback
                  class="w-full h-full object-cover rounded-[22px] transition-all duration-300"
                  loading="eager"
                />
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
                  {{ item?.condition || 'Like New' }}
                </span>
              </div>

              <!-- Thumbnail Strip -->
              @if ((item?.images?.length || 0) > 1) {
                <div class="flex items-center space-x-2 mt-3 overflow-x-auto pb-1">
                  @for (img of item!.images; track img; let i = $index) {
                    <button
                      type="button"
                      (click)="quickPreviewService.selectImage(i)"
                      [class]="quickPreviewService.selectedImageIndex() === i
                        ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 opacity-100 scale-105'
                        : 'opacity-60 hover:opacity-100'"
                      class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all shrink-0"
                    >
                      <img [src]="img" appImageFallback class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }

              <!-- Environmental Impact Banner -->
              <div class="mt-4 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/40 shadow-sm">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span class="text-xs">🌱</span>
                  </div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Sustainability Impact</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-center">
                  <div class="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/30">
                    <p class="text-base font-black text-emerald-600 dark:text-emerald-400">8.2 kg</p>
                    <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400">CO₂ Rescued</p>
                  </div>
                  <div class="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/30">
                    <p class="text-base font-black text-teal-600 dark:text-teal-400">2,700 L</p>
                    <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Water Saved</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══ RIGHT COLUMN: Garment Info & Actions ═══ -->
            <div class="flex-1 p-5 md:p-7 md:pl-2 flex flex-col justify-between space-y-6">

              <div class="space-y-4">
                <!-- Category & Condition Badges -->
                <div class="flex items-center space-x-2">
                  <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ {{ item?.condition || 'Like New' }}
                  </span>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {{ item?.category || 'Tops' }}
                  </span>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Size: {{ item?.size || 'M' }}
                  </span>
                </div>

                <!-- Title -->
                <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {{ item?.title || 'Clothing Garment' }}
                </h2>

                <!-- Value Estimate Highlight -->
                <div class="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-700/50">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <span class="text-xl">🏷️</span>
                  </div>
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Swap Value</p>
                    <p class="text-2xl font-black text-slate-900 dark:text-white">₹{{ item?.valueEstimate || 50 }}</p>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ item?.description || 'Pre-loved clothing available for sustainable peer-to-peer swap.' }}
                </p>

                <!-- Attribute Specs Grid -->
                <div class="grid grid-cols-2 gap-3 pt-2">
                  <div class="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brand</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item?.brand || 'Pre-Loved' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item?.gender || 'Unisex' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white truncate">📍 {{ item?.location || 'India' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Material</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ item?.material || 'Organic Blend' }}</p>
                  </div>
                </div>

                <!-- Swapper Profile Card -->
                <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50">
                  <div class="flex items-center space-x-3">
                    <img
                      [src]="item?.owner?.avatarUrl || defaultUserAvatar"
                      [alt]="item?.owner?.name || 'Swapper'"
                      appImageFallback
                      class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <div class="flex items-center space-x-1.5">
                        <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item?.owner?.name || 'Verified Swapper' }}</p>
                        <span class="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Verified</span>
                      </div>
                      <p class="text-[10px] text-slate-400 mt-0.5">★ 4.9 Rating • Active Swapper</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  (click)="viewFullDetails()"
                  class="flex-1 px-6 py-3.5 rounded-full btn-primary text-xs font-black text-center shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <span>View Garment Details Page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l7-7m-7 7H3" />
                  </svg>
                </button>

                <button
                  type="button"
                  (click)="quickPreviewService.close()"
                  class="px-5 py-3.5 rounded-full btn-secondary text-xs font-bold text-center"
                >
                  Close Preview
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    }
  `,
})
export class QuickPreviewModalComponent {
  quickPreviewService = inject(QuickPreviewService);
  private router = inject(Router);

  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;
  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;

  get item() {
    return this.quickPreviewService.previewItem();
  }

  get selectedImage(): string {
    const item = this.item;
    if (!item?.images?.length) return this.defaultItemImage;
    const index = this.quickPreviewService.selectedImageIndex();
    return item.images[index] || item.images[0] || this.defaultItemImage;
  }

  viewFullDetails(): void {
    const itemId = this.item?._id || 'item';
    this.quickPreviewService.close();
    this.router.navigate(['/items', itemId]);
  }
}
