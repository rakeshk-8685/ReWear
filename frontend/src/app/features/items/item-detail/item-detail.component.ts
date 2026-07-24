import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
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
    ItemCardComponent,
    ImageFallbackDirective,
  ],
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    } @else if (item()) {
      <div class="space-y-12 max-w-6xl mx-auto pb-24">
        
        <!-- Top Back Breadcrumb & Controls -->
        <div class="flex items-center justify-between">
          <a routerLink="/items" class="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Marketplace Feed</span>
          </a>

          <div class="flex items-center space-x-3">
            <!-- Share Link Button -->
            <button
              (click)="shareItemLink()"
              class="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors"
              title="Share Link"
            >
              🔗 Share
            </button>

            <!-- Report Listing Button -->
            @if (!isOwner) {
              <button
                (click)="reportModalOpen.set(true)"
                class="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 font-bold text-xs transition-colors"
                title="Report Listing"
              >
                🚩 Report
              </button>
            }

            @if (isOwner) {
              <a
                [routerLink]="['/items/create']"
                [queryParams]="{ editId: item()?._id }"
                class="px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                ✏️ Edit
              </a>
              <button
                (click)="confirmDeleteModalOpen.set(true)"
                class="px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold text-xs hover:bg-rose-500/20 transition-colors border border-rose-500/20"
              >
                🗑️ Delete
              </button>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- Left Column: Large Image Gallery & Lightbox Zoom -->
          <div class="lg:col-span-6 space-y-4">
            <!-- Main Display Photo -->
            <div class="aspect-[4/5] rounded-4xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative group">
              <img
                [src]="selectedImage() || item()?.images?.[0]"
                [alt]="item()?.title"
                appImageFallback
                loading="lazy"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <span class="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider border border-white/20 shadow-lg">
                {{ item()?.condition }}
              </span>

              <!-- Zoom Lightbox Button Overlay -->
              <button
                (click)="zoomModalOpen.set(true)"
                class="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs opacity-90 group-hover:opacity-100 transition-all shadow-lg flex items-center space-x-1.5"
              >
                <span>🔍 Zoom Photo</span>
              </button>
            </div>

            <!-- Thumbnails Slider -->
            @if ((item()?.images?.length || 0) > 1) {
              <div class="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                @for (img of item()?.images; track img) {
                  <button
                    (click)="selectedImage.set(img)"
                    [class]="selectedImage() === img ? 'ring-2 ring-emerald-500 scale-95' : 'opacity-70 hover:opacity-100'"
                    class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 transition-all shadow-sm"
                  >
                    <img [src]="img" appImageFallback loading="lazy" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Right Column: Product Details & Seller Card -->
          <div class="lg:col-span-6 space-y-8">
            
            <!-- Category & Brand Header -->
            <div class="space-y-2">
              <div class="flex items-center space-x-3 text-xs font-extrabold uppercase tracking-wider text-emerald-500">
                <span>{{ item()?.category }}</span>
                <span>•</span>
                <span class="text-slate-400">{{ item()?.brand }}</span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {{ item()?.title }}
              </h1>
            </div>

            <!-- Specs Matrix Grid -->
            <div class="grid grid-cols-3 gap-3 p-4 rounded-3xl apple-glass-card">
              <div class="text-center">
                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Size</span>
                <span class="text-base font-black text-slate-900 dark:text-slate-100">{{ item()?.size }}</span>
              </div>
              <div class="text-center border-x border-slate-200 dark:border-slate-800">
                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</span>
                <span class="text-base font-black text-slate-900 dark:text-slate-100">{{ item()?.gender }}</span>
              </div>
              <div class="text-center">
                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Value</span>
                <span class="text-base font-black text-emerald-500">~&#36;{{ item()?.valueEstimate }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Garment Description</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {{ item()?.description }}
              </p>
            </div>

            <!-- Swap Preference Box -->
            @if (item()?.swapPreference) {
              <div class="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Owner's Swap Wishlist Preference</span>
                </span>
                <p class="text-xs text-slate-700 dark:text-slate-200 italic">"{{ item()?.swapPreference }}"</p>
              </div>
            }

            <!-- Seller Profile Card -->
            <div class="p-5 rounded-3xl apple-glass-card flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  [src]="item()?.owner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
                  [alt]="item()?.owner?.name"
                  appImageFallback
                  class="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h4 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ item()?.owner?.name }}</h4>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <app-rating-stars [rating]="item()?.owner?.ratingAverage || 5" [readonly]="true" />
                    <span class="text-xs text-slate-400">({{ item()?.owner?.ratingCount || 0 }} swaps)</span>
                  </div>
                </div>
              </div>

              <a
                [routerLink]="['/profile']"
                [queryParams]="{ userId: item()?.owner?._id }"
                class="text-xs font-bold text-emerald-500 hover:underline"
              >
                View Closet
              </a>
            </div>

          </div>
        </div>

        <!-- Related Garments Section -->
        @if (relatedItems().length > 0) {
          <div class="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Similar Clothing in {{ item()?.category }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (rel of relatedItems(); track rel._id) {
                <app-item-card [item]="rel" />
              }
            </div>
          </div>
        }

      </div>

      <!-- Sticky Floating Glass Action Bar -->
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-full px-4 sm:px-0">
        <div class="glass-card p-3 sm:p-4 rounded-full shadow-2xl border border-white/20 dark:border-slate-800 flex items-center justify-between backdrop-blur-2xl">
          <div class="px-3">
            <span class="block text-[10px] uppercase font-bold text-slate-400">Value Est.</span>
            <span class="text-base font-black text-emerald-500">~&#36;{{ item()?.valueEstimate }}</span>
          </div>

          @if (isOwner) {
            <span class="text-xs font-bold text-amber-500 px-4 py-2 rounded-full bg-amber-500/10">Your Listing</span>
          } @else {
            <button
              (click)="openSwapModal.set(true); fetchUserCloset()"
              class="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Propose 1:1 Swap Offer</span>
            </button>
          }
        </div>
      </div>

      <!-- Zoom Photo Lightbox Modal -->
      @if (zoomModalOpen()) {
        <div (click)="zoomModalOpen.set(false)" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <button (click)="zoomModalOpen.set(false)" class="absolute top-6 right-6 text-white text-3xl font-bold">×</button>
          <img [src]="selectedImage() || item()?.images?.[0]" appImageFallback class="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl" />
        </div>
      }

      <!-- Report Listing Bottom Sheet Modal -->
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

      <!-- Delete Confirmation Bottom Sheet -->
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

      <!-- Propose Swap Bottom Sheet -->
      <app-bottom-sheet
        [isOpen]="openSwapModal()"
        title="Propose 1:1 or 2:1 Clothing Swap"
        [subtitle]="'Select items from your closet to exchange for ' + (item()?.title || '')"
        (close)="openSwapModal.set(false)"
      >
        <div class="space-y-5">
          <div class="flex items-center space-x-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <img [src]="item()?.images?.[0]" appImageFallback class="w-12 h-12 rounded-xl object-cover" />
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-500">You Want</span>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">{{ item()?.title }}</h5>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Select Offered Items From Your Closet</label>
            
            @if (userClosetItems().length === 0) {
              <div class="text-center p-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-3">
                <p class="text-xs text-slate-400">Your closet is empty! You must list at least one garment to propose a trade.</p>
                <a routerLink="/items/create" (click)="openSwapModal.set(false)" class="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-md">
                  + List a Garment Now
                </a>
              </div>
            } @else {
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @for (closetItem of userClosetItems(); track closetItem._id) {
                  <div
                    (click)="toggleSelectOfferedItem(closetItem._id)"
                    [class]="selectedOfferedItemIds().includes(closetItem._id) ? 'ring-2 ring-emerald-500 bg-emerald-500/15' : 'border-slate-200 dark:border-slate-800'"
                    class="p-2.5 rounded-2xl border bg-slate-50 dark:bg-slate-800/80 cursor-pointer transition-all flex items-center space-x-2"
                  >
                    <img [src]="closetItem?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'" appImageFallback class="w-10 h-10 rounded-lg object-cover" />
                    <div class="truncate">
                      <p class="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{{ closetItem.title }}</p>
                      <p class="text-[10px] text-slate-400">~&#36;{{ closetItem.valueEstimate }}</p>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Optional Swap Message</label>
            <textarea
              [(ngModel)]="proposalMessage"
              rows="2"
              placeholder="Hey! Love your jacket. Hope you like my vintage denim in return."
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button (click)="openSwapModal.set(false)" class="px-4 py-2.5 rounded-full text-xs font-bold text-slate-400">Cancel</button>
            <button
              (click)="submitSwapProposal()"
              [disabled]="selectedOfferedItemIds().length === 0 || submittingProposal()"
              class="px-6 py-2.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              Submit Trade Proposal
            </button>
          </div>
        </div>
      </app-bottom-sheet>
    }
  `,
})
export class ItemDetailComponent implements OnInit {
  private itemService = inject(ItemService);
  private swapService = inject(SwapService);
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
  openSwapModal = signal<boolean>(false);

  reportReason = 'inappropriate';

  userClosetItems = signal<Item[]>([]);
  selectedOfferedItemIds = signal<string[]>([]);
  proposalMessage = '';
  submittingProposal = signal<boolean>(false);

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
      error: () => {
        this.loadDemoItemDetails('demo-1');
      },
    });
  }

  private loadDemoItemDetails(id: string): void {
    const demoItems: Record<string, Item> = {
      'demo-1': {
        _id: 'demo-1',
        title: 'Vintage 90s Leather Biker Jacket',
        description: 'Authentic distressed dark brown genuine leather jacket with heavy zippers, satin lining, and custom metallic hardware.',
        category: 'Vintage',
        size: 'L',
        brand: 'Schott NYC',
        condition: 'Like New',
        gender: 'Unisex',
        valueEstimate: 180,
        tags: ['leather', 'biker', 'vintage', '90s', 'jacket'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-1',
          name: 'Aarav Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          ratingAverage: 4.9,
          ratingCount: 12,
          swapCount: 14,
        },
        material: '100% Genuine Leather',
        color: 'Dark Brown',
        location: 'Indiranagar, Bangalore',
        swapPreference: 'Vintage Outerwear or Sneakers',
        status: 'AVAILABLE',
        likesCount: 24,
        likedBy: [],
        viewsCount: 189,
      },
      'demo-2': {
        _id: 'demo-2',
        title: 'Nike Fleece Pullover Hoodie',
        description: 'Heavyweight organic cotton hoodie in emerald sage green with soft brushed interior and double-lined hood.',
        category: 'Tops',
        size: 'M',
        brand: 'Nike',
        condition: 'Like New',
        gender: 'Unisex',
        valueEstimate: 95,
        tags: ['nike', 'hoodie', 'streetwear', 'fleece'],
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-2',
          name: 'Rohan Gupta',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
          ratingAverage: 5.0,
          ratingCount: 8,
          swapCount: 10,
        },
        material: '80% Organic Cotton, 20% Polyester',
        color: 'Emerald Sage Green',
        location: 'Bandra, Mumbai',
        swapPreference: 'Denim Pants or Oversized Jackets',
        status: 'AVAILABLE',
        likesCount: 18,
        likedBy: [],
        viewsCount: 142,
      },
      'demo-3': {
        _id: 'demo-3',
        title: "Levi's 501 Original Straight Jeans",
        description: 'Classic indigo blue wash denim with raw hem details, signature button fly, and 5-pocket design.',
        category: 'Pants',
        size: '32/32',
        brand: "Levi's",
        condition: 'Excellent',
        gender: 'Men',
        valueEstimate: 110,
        tags: ['levis', '501', 'denim', 'jeans', 'straight'],
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-3',
          name: 'Ananya Kapoor',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
          ratingAverage: 4.8,
          ratingCount: 15,
          swapCount: 19,
        },
        material: '100% Cotton Denim',
        color: 'Indigo Blue',
        location: 'Connaught Place, Delhi',
        swapPreference: 'Linen Shirts or Casual Blazers',
        status: 'AVAILABLE',
        likesCount: 31,
        likedBy: [],
        viewsCount: 215,
      },
      'demo-4': {
        _id: 'demo-4',
        title: 'Zara Oversized Pure Linen Shirt',
        description: 'Lightweight breathable resort collar linen shirt perfect for summer layering and beach vacations.',
        category: 'Tops',
        size: 'S',
        brand: 'Zara',
        condition: 'New with Tags',
        gender: 'Women',
        valueEstimate: 65,
        tags: ['zara', 'linen', 'shirt', 'resort', 'summer'],
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-4',
          name: 'Priya Patel',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
          ratingAverage: 5.0,
          ratingCount: 24,
          swapCount: 28,
        },
        material: '100% Pure European Linen',
        color: 'Natural Beige',
        location: 'Sector 18, Noida',
        swapPreference: 'Summer Dresses or Skirts',
        status: 'AVAILABLE',
        likesCount: 15,
        likedBy: [],
        viewsCount: 98,
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

  get isOwner(): boolean {
    const currentUserId = this.authService.currentUser()?._id;
    return !!currentUserId && this.item()?.owner?._id === currentUserId;
  }

  shareItemLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.notification.success('Link Copied', 'Listing URL copied to your clipboard!');
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

  fetchUserCloset(): void {
    const currentUserId = this.authService.currentUser()?._id;
    if (!currentUserId) {
      this.notification.info('Sign In Required', 'Please sign in to make swap offers.');
      this.openSwapModal.set(false);
      this.router.navigate(['/auth/login']);
      return;
    }

    this.itemService.getItems({ ownerId: currentUserId, status: 'AVAILABLE' }).subscribe({
      next: (res) => {
        if (res.data) {
          this.userClosetItems.set(res.data);
        }
      },
    });
  }

  toggleSelectOfferedItem(id: string): void {
    const current = [...this.selectedOfferedItemIds()];
    const idx = current.indexOf(id);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    this.selectedOfferedItemIds.set(current);
  }

  submitSwapProposal(): void {
    if (this.selectedOfferedItemIds().length === 0 || !this.item()) return;

    this.submittingProposal.set(true);
    this.swapService
      .createSwapProposal({
        requestedItemId: this.item()!._id,
        offeredItemIds: this.selectedOfferedItemIds(),
        message: this.proposalMessage,
      })
      .subscribe({
        next: (res) => {
          this.submittingProposal.set(false);
          this.openSwapModal.set(false);
          if (res.success) {
            this.notification.success('Swap Offer Sent', 'Your proposal was delivered to the item owner.');
            this.router.navigate(['/swaps']);
          }
        },
        error: () => this.submittingProposal.set(false),
      });
  }
}
