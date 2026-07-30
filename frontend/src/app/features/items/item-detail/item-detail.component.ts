import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../../core/services/item.service';
import { SwapService } from '../../../core/services/swap.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Item } from '../../../core/models/item.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { BottomSheetComponent } from '../../../shared/components/bottom-sheet/bottom-sheet.component';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    RatingStarsComponent,
    BottomSheetComponent,
    ImageFallbackDirective,
  ],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 md:px-12 pb-24">
      <div class="max-w-6xl mx-auto space-y-12">
        
        <!-- Breadcrumb Navigation Bar -->
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <a routerLink="/items" class="hover:text-slate-600 dark:hover:text-slate-200">Browse</a>
          <span>›</span>
          <span class="text-slate-500">{{ item()?.category || 'Outerwear' }}</span>
          <span>›</span>
          <span class="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">
            {{ item()?.title || 'Vintage Denim Jacket' }}
          </span>
        </div>

        @if (loading()) {
          <div class="flex items-center justify-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        } @else if (item()) {
          <!-- Main Product Display (2 Columns on Web, 1 Column on Mobile/Tablet) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            <!-- Left Column: Gallery & Images -->
            <div class="lg:col-span-6 space-y-4">
              
              <!-- Large Display Photo Frame -->
              <div class="aspect-[4/4.8] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800/80 p-4 flex items-center justify-center relative overflow-hidden shadow-inner group border border-slate-200/60 dark:border-slate-800">
                <img
                  [src]="selectedImage() || item()?.images?.[0]"
                  [alt]="item()?.title"
                  appImageFallback
                  loading="lazy"
                  class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                />

                <!-- Top Left Condition Badge -->
                <span class="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white font-extrabold text-[10px] uppercase rounded-full shadow-sm tracking-wider">
                  {{ item()?.condition || 'LIKE NEW' }}
                </span>

                <!-- Zoom Photo Overlay Button -->
                <button
                  (click)="zoomModalOpen.set(true)"
                  class="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/80 text-white font-bold text-xs opacity-80 group-hover:opacity-100 transition-all shadow-md flex items-center space-x-1"
                >
                  <span>🔍 Zoom</span>
                </button>
              </div>

              <!-- Thumbnails Selector Row -->
              <div class="grid grid-cols-4 gap-3">
                @for (img of galleryImages(); track img + '-' + $index) {
                  <button
                    (click)="selectedImage.set(img)"
                    [class]="selectedImage() === img ? 'border-slate-900 dark:border-white shadow-md' : 'border-transparent opacity-70 hover:opacity-100'"
                    class="aspect-square rounded-2xl overflow-hidden bg-[#f4f2ea] dark:bg-slate-800 p-1 border-2 transition-all cursor-pointer"
                  >
                    <img [src]="img" appImageFallback loading="lazy" class="w-full h-full object-cover rounded-xl" />
                  </button>
                }
              </div>

            </div>

            <!-- Right Column: Specs, Seller & Actions -->
            <div class="lg:col-span-6 space-y-6">
              
              <!-- Subtitle & Main Title -->
              <div>
                <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  {{ item()?.brand || "LEVI'S" }} · {{ item()?.condition || 'Excellent Condition' }}
                </span>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {{ item()?.title }}
                </h1>
              </div>

              <!-- Estimated Value & Availability Card -->
              <div class="bg-[#f4f3ed] dark:bg-slate-900 rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    ESTIMATED SWAP VALUE
                  </span>
                  <span class="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
                    ₹{{ item()?.valueEstimate || 45 }}
                  </span>
                </div>

                <div class="text-right">
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    AVAILABILITY
                  </span>
                  <span class="text-xs font-extrabold text-[#2d5c2b] dark:text-emerald-400 block mt-0.5">
                    • Available Now
                  </span>
                </div>
              </div>

              <!-- 2x2 Specs Matrix Grid -->
              <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-xs py-4 border-y border-slate-200/60 dark:border-slate-800">
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Size
                  </span>
                  <span class="text-xs font-extrabold text-slate-900 dark:text-white">
                    {{ item()?.size || 'Medium (EU 48)' }}
                  </span>
                </div>

                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Color
                  </span>
                  <span class="text-xs font-extrabold text-slate-900 dark:text-white">
                    {{ item()?.color || 'Indigo Blue' }}
                  </span>
                </div>

                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Location
                  </span>
                  <span class="text-xs font-extrabold text-slate-900 dark:text-white">
                    {{ item()?.location || 'East London, 2.4 km away' }}
                  </span>
                </div>

                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Material
                  </span>
                  <span class="text-xs font-extrabold text-slate-900 dark:text-white">
                    {{ item()?.material || '100% Organic Cotton' }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-1">
                <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Description
                </span>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {{ item()?.description || 'Classic 90s era denim jacket in a beautiful deep indigo wash. Features four pockets, copper buttons, and the iconic red tab. No visible signs of wear, kept in a smoke-free environment. Perfect for layering over hoodies or dresses.' }}
                </p>
              </div>

              <!-- Seller Profile Card -->
              <div class="bg-[#f4f3ed] dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div class="flex items-center space-x-3">
                  <img
                    [src]="item()?.owner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
                    [alt]="item()?.owner?.name || 'Sarah Williams'"
                    appImageFallback
                    class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <div class="flex items-center space-x-1">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">
                        {{ item()?.owner?.name || 'Sarah Williams' }}
                      </h4>
                      <span class="text-blue-500 text-xs font-black" title="Verified Swapper">✓</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      ⭐ {{ item()?.owner?.ratingAverage || 4.9 }} · {{ item()?.owner?.swapCount || 24 }} successful swaps
                    </p>
                  </div>
                </div>

                <a
                  [routerLink]="['/profile']"
                  [queryParams]="{ userId: item()?.owner?._id }"
                  class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                >
                  View Profile
                </a>
              </div>

              <!-- Action Buttons Stack -->
              <div class="space-y-2.5">
                @if (isOwner) {
                  <div class="flex items-center space-x-3">
                    <a
                      [routerLink]="['/items/create']"
                      [queryParams]="{ editId: item()?._id }"
                      class="flex-1 py-3 px-4 text-center rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                    >
                      ✏️ Edit Listing
                    </a>
                    <button
                      (click)="confirmDeleteModalOpen.set(true)"
                      class="py-3 px-4 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-xs hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                } @else {
                  <a
                    [routerLink]="['/swaps/request', item()?._id]"
                    class="bg-[#2d5c2b] hover:bg-[#234821] text-white font-extrabold py-3.5 px-6 rounded-2xl w-full text-center text-sm shadow-md transition-all cursor-pointer block"
                  >
                    Request Swap
                  </a>

                  <button
                    (click)="messageOwner()"
                    class="bg-[#e8e6df] dark:bg-slate-800 hover:bg-[#dfdcd3] text-slate-800 dark:text-slate-200 font-bold py-3.5 px-6 rounded-2xl w-full text-center text-sm transition-all cursor-pointer block"
                  >
                    Message Owner
                  </button>
                }
              </div>

              <!-- Safety Protection Notice Banner -->
              <div class="bg-blue-50/80 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-100 dark:border-blue-900 flex items-start space-x-2 text-[11px] text-blue-700 dark:text-blue-300">
                <span class="text-sm shrink-0">🛡️</span>
                <p class="leading-snug">
                  Meet safely in public locations or use tracked delivery for remote swaps. ReWear protects your items during the exchange.
                </p>
              </div>

            </div>

          </div>

          <!-- Section 2: Items Sarah Accepts -->
          <div class="space-y-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Items {{ ownerFirstName() }} Accepts
                </h2>
                <p class="text-xs text-slate-400">
                  {{ ownerFirstName() }} is looking for these categories in exchange
                </p>
              </div>

              <button class="text-xs font-bold text-slate-500 hover:underline cursor-pointer">
                View all preferences
              </button>
            </div>

            <!-- Wishlist Category Cards -->
            <div class="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-none">
              <div class="bg-[#f4f3ed] dark:bg-slate-900 rounded-2xl p-4 text-center min-w-[110px] font-bold text-xs flex flex-col items-center justify-center space-y-2 border border-slate-200/60 dark:border-slate-800">
                <span class="text-xl">👗</span>
                <span class="text-slate-800 dark:text-slate-200">Dresses</span>
              </div>

              <div class="bg-[#f4f3ed] dark:bg-slate-900 rounded-2xl p-4 text-center min-w-[110px] font-bold text-xs flex flex-col items-center justify-center space-y-2 border border-slate-200/60 dark:border-slate-800">
                <span class="text-xl">🧥</span>
                <span class="text-slate-800 dark:text-slate-200">Knitwear</span>
              </div>

              <div class="bg-[#f4f3ed] dark:bg-slate-900 rounded-2xl p-4 text-center min-w-[110px] font-bold text-xs flex flex-col items-center justify-center space-y-2 border border-slate-200/60 dark:border-slate-800">
                <span class="text-xl">👜</span>
                <span class="text-slate-800 dark:text-slate-200">Bags</span>
              </div>
            </div>
          </div>

          <!-- Section 3: Similar Items Nearby -->
          <div class="space-y-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Similar Items Nearby
              </h2>

              <button class="text-xs font-bold text-slate-500 hover:underline cursor-pointer">
                See more
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (rel of displayRelatedItems(); track rel._id) {
                <div [routerLink]="['/items', rel._id]" class="group cursor-pointer block">
                  <div class="aspect-square rounded-3xl bg-[#f4f2ea] dark:bg-slate-800 p-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-all shadow-inner mb-3">
                    <img
                      [src]="rel.images?.[0]"
                      [alt]="rel.title"
                      appImageFallback
                      class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                    />

                    <!-- Favorite heart button -->
                    <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-4.5-4.5h-1.586a1.5 1.5 0 01-1.06-.44l-1.414-1.414a1.5 1.5 0 00-2.12 0L7.586 6.318a1.5 1.5 0 01-1.06.44H4.318z" />
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-0.5">
                    <div class="flex items-center justify-between gap-2">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {{ rel.title }}
                      </h4>
                      <span class="text-xs font-black text-slate-900 dark:text-white shrink-0">
                        ₹{{ rel.valueEstimate }}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 font-medium">
                      {{ rel.brand }} · Size {{ rel.size }} · {{ rel.location || '1.2km' }}
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>
        }

      </div>

      <!-- Mobile Sticky Floating Action Bar -->
      @if (!isOwner && item()) {
        <div class="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-sm w-full px-4">
          <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-extrabold uppercase text-slate-400 block">Estimated Value</span>
              <span class="text-base font-black text-slate-900 dark:text-white block">₹{{ item()?.valueEstimate }}</span>
            </div>

            <a
              [routerLink]="['/swaps/request', item()?._id]"
              class="px-6 py-2.5 rounded-xl bg-[#2d5c2b] text-white font-extrabold text-xs shadow-md"
            >
              Request Swap
            </a>
          </div>
        </div>
      }

      <!-- Zoom Photo Lightbox Modal -->
      @if (zoomModalOpen()) {
        <div (click)="zoomModalOpen.set(false)" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <button (click)="zoomModalOpen.set(false)" class="absolute top-6 right-6 text-white text-3xl font-bold">×</button>
          <img [src]="selectedImage() || item()?.images?.[0]" appImageFallback class="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl" />
        </div>
      }

      <!-- Report Listing Modal -->
      <app-bottom-sheet
        [isOpen]="reportModalOpen()"
        title="Report Listing"
        subtitle="Flag this clothing listing for moderator review"
        (close)="reportModalOpen.set(false)"
      >
        <div class="space-y-4 pt-2">
          <label class="block text-xs font-bold uppercase text-slate-400">Select Reason</label>
          <select [(ngModel)]="reportReason" class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs">
            <option value="inappropriate">Inappropriate Content</option>
            <option value="counterfeit">Counterfeit / Fake Brand</option>
            <option value="misleading">Misleading Description / Condition</option>
            <option value="spam">Spam or Duplicate Listing</option>
          </select>
          <div class="flex items-center justify-end space-x-3 pt-2">
            <button (click)="reportModalOpen.set(false)" class="px-4 py-2 rounded-full text-xs font-bold text-slate-400">Cancel</button>
            <button (click)="submitReport()" class="px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">Submit Report</button>
          </div>
        </div>
      </app-bottom-sheet>

      <!-- Delete Confirmation Modal -->
      <app-bottom-sheet
        [isOpen]="confirmDeleteModalOpen()"
        title="Delete Garment Listing?"
        subtitle="This action cannot be undone."
        (close)="confirmDeleteModalOpen.set(false)"
      >
        <div class="space-y-4 pt-2">
          <p class="text-xs text-slate-400">Are you sure you want to delete "{{ item()?.title }}"?</p>
          <div class="flex items-center justify-end space-x-3">
            <button (click)="confirmDeleteModalOpen.set(false)" class="px-4 py-2 rounded-full text-xs font-bold text-slate-400">Cancel</button>
            <button (click)="deleteItem()" class="px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">Confirm Delete</button>
          </div>
        </div>
      </app-bottom-sheet>

    </div>
  `,
})
export class ItemDetailComponent implements OnInit {
  private itemService = inject(ItemService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item = signal<Item | null>(null);
  relatedItems = signal<Item[]>([]);
  loading = signal<boolean>(true);
  selectedImage = signal<string>('');

  zoomModalOpen = signal<boolean>(false);
  reportModalOpen = signal<boolean>(false);
  confirmDeleteModalOpen = signal<boolean>(false);

  reportReason = 'inappropriate';

  galleryImages = computed(() => {
    const images = this.item()?.images || [];
    if (images.length > 0) {
      if (images.length >= 4) return images.slice(0, 4);
      const padded = [...images];
      while (padded.length < 4) {
        padded.push(images[0]);
      }
      return padded;
    }
    return [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    ];
  });

  displayRelatedItems = computed(() => {
    if (this.relatedItems().length > 0) return this.relatedItems();
    return [
      {
        _id: 'demo-rel-1',
        title: 'Black Denim Jacket',
        description: 'Classic dark black denim jacket.',
        category: 'Outerwear' as any,
        size: 'S',
        brand: 'Wrangler',
        condition: 'Excellent' as any,
        gender: 'Men' as any,
        valueEstimate: 40,
        tags: ['denim'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        owner: { _id: 'user-2', name: 'Marcus Chen' },
        location: '1.2km away',
        status: 'AVAILABLE' as any,
        likesCount: 10,
      },
    ];
  });

  ownerFirstName = computed(() => {
    const name = this.item()?.owner?.name || 'Sarah';
    return name.split(' ')[0];
  });

  get isOwner(): boolean {
    const currentUserId = this.authService.currentUser()?._id;
    return !!currentUserId && this.item()?.owner?._id === currentUserId;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        if (id.startsWith('demo-')) {
          this.loadDemoItemDetails(id);
        } else {
          this.fetchItemDetails(id);
        }
      }
    });
  }

  private fetchItemDetails(id: string): void {
    this.loading.set(true);
    this.itemService.getItemById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.data) {
          this.item.set(res.data);
          if (res.data.images?.length) {
            this.selectedImage.set(res.data.images[0]);
          }
          this.fetchRelatedItems(res.data.category, res.data._id);
        } else {
          this.loadDemoItemDetails('demo-1');
        }
      },
      error: () => this.loadDemoItemDetails('demo-1'),
    });
  }

  private loadDemoItemDetails(id: string): void {
    const demoItems: Record<string, Item> = {
      'demo-1': {
        _id: 'demo-1',
        title: 'Vintage Denim Jacket',
        description: 'Classic 90s era denim jacket in a beautiful deep indigo wash. Features four pockets, copper buttons, and the iconic red tab. No visible signs of wear, kept in a smoke-free environment. Perfect for layering over hoodies or dresses.',
        category: 'Outerwear' as any,
        size: 'Medium (EU 48)',
        brand: "LEVI'S",
        condition: 'Like New' as any,
        gender: 'Unisex' as any,
        valueEstimate: 45,
        color: 'Indigo Blue',
        location: 'East London, 2.4 km away',
        material: '100% Organic Cotton',
        tags: ['denim', 'jacket', 'levis'],
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
        ],
        owner: {
          _id: 'user-1',
          name: 'Sarah Williams',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          ratingAverage: 4.9,
          ratingCount: 24,
          swapCount: 24,
        },
        status: 'AVAILABLE' as any,
        likesCount: 24,
      },
    };

    const target = demoItems[id] || demoItems['demo-1'];
    this.item.set(target);
    this.selectedImage.set(target.images[0]);
    this.loading.set(false);
    this.fetchRelatedItems(target.category, target._id);
  }

  private fetchRelatedItems(category: string, currentId: string): void {
    this.itemService.getItems({ category, limit: 4 }).subscribe({
      next: (res) => {
        if (res.data) {
          this.relatedItems.set(res.data.filter((i) => i._id !== currentId));
        }
      },
    });
  }

  submitReport(): void {
    this.reportModalOpen.set(false);
    this.notification.success('Report Submitted', 'Listing flagged for moderator review.');
  }

  deleteItem(): void {
    const id = this.item()?._id;
    if (!id) return;

    this.itemService.deleteItem(id).subscribe({
      next: (res) => {
        this.confirmDeleteModalOpen.set(false);
        if (res.success) {
          this.notification.success('Item Deleted', 'Listing removed from marketplace.');
          this.router.navigate(['/items']);
        }
      },
    });
  }

  messageOwner(): void {
    const ownerId = this.item()?.owner?._id;
    if (ownerId) {
      this.router.navigate(['/chat'], { queryParams: { userId: ownerId } });
    } else {
      this.router.navigate(['/chat']);
    }
  }
}
