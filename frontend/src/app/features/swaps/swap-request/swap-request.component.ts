import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../../core/services/item.service';
import { SwapService } from '../../../core/services/swap.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Item } from '../../../core/models/item.model';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { BottomSheetComponent } from '../../../shared/components/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-swap-request',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ImageFallbackDirective, BottomSheetComponent],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 pt-4 px-4 sm:px-6 md:px-8">
      <div class="max-w-4xl mx-auto space-y-8">
        
        <!-- Top Navigation Bar -->
        <div class="grid grid-cols-3 items-center py-2">
          <div>
            <a
              [routerLink]="targetItem() ? ['/items', targetItem()?._id] : '/items'"
              class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Listing</span>
            </a>
          </div>

          <div class="text-center">
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">Request a Swap</h2>
          </div>

          <div></div>
        </div>

        <!-- Main Title Header -->
        <div class="text-center space-y-2 max-w-xl mx-auto pt-2">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Is this a fair swap?
          </h1>
          <p class="text-sm sm:text-base text-slate-500 font-medium">
            Compare items and values before sending your request.
          </p>
        </div>

        <!-- Side-by-Side Comparison Container -->
        @if (loading()) {
          <div class="flex items-center justify-center py-24">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        } @else {
          <div class="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-sm relative">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch relative">
              
              <!-- Center Floating Swap Button -->
              <button
                (click)="openChangeItemModal.set(true)"
                class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold hover:rotate-180 hover:scale-110 transition-all duration-300 cursor-pointer"
                title="Change Offered Garment"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <!-- Left Column: YOUR OFFER -->
              <div class="flex flex-col justify-between space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    YOUR OFFER
                  </span>
                  <button
                    (click)="openChangeItemModal.set(true)"
                    class="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Change Item
                  </button>
                </div>

                @if (offeredItem()) {
                  <!-- Photo Container -->
                  <div class="aspect-[4/4.2] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800/80 p-6 flex items-center justify-center overflow-hidden relative group shadow-inner">
                    <img
                      [src]="offeredItem()?.images?.[0]"
                      [alt]="offeredItem()?.title"
                      appImageFallback
                      class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                    />
                  </div>

                  <!-- Details -->
                  <div class="space-y-1">
                    <h3 class="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {{ offeredItem()?.title }}
                    </h3>
                    <p class="text-xs text-slate-500 font-medium">
                      {{ offeredItem()?.brand || 'Brand' }} · Size {{ offeredItem()?.size || 'M' }} · {{ offeredItem()?.condition || 'Excellent' }}
                    </p>
                  </div>

                  <!-- Price Row -->
                  <div class="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-500">Estimated Value</span>
                    <span class="text-lg font-black text-slate-900 dark:text-white">
                      {{ formatCurrency(offeredItem()?.valueEstimate || 0) }}
                    </span>
                  </div>
                } @else {
                  <div class="aspect-[4/4.2] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <p class="text-xs text-slate-400 font-medium">No item selected from your closet yet</p>
                    <button
                      (click)="openChangeItemModal.set(true)"
                      class="px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                    >
                      + Select Closet Garment
                    </button>
                  </div>
                }
              </div>

              <!-- Right Column: TARGET ITEM -->
              <div class="flex flex-col justify-between space-y-4 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    TARGET ITEM
                  </span>
                </div>

                @if (targetItem()) {
                  <!-- Photo Container -->
                  <div class="aspect-[4/4.2] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800/80 p-6 flex items-center justify-center overflow-hidden relative group shadow-inner">
                    <img
                      [src]="targetItem()?.images?.[0]"
                      [alt]="targetItem()?.title"
                      appImageFallback
                      class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                    />
                  </div>

                  <!-- Details -->
                  <div class="space-y-1">
                    <h3 class="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {{ targetItem()?.title }}
                    </h3>
                    <p class="text-xs text-slate-500 font-medium">
                      {{ targetItem()?.brand || 'Brand' }} · Size {{ targetItem()?.size || 'M' }} · {{ targetItem()?.condition || 'Like New' }}
                    </p>
                  </div>

                  <!-- Price Row -->
                  <div class="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-500">Estimated Value</span>
                    <span class="text-lg font-black text-slate-900 dark:text-white">
                      {{ formatCurrency(targetItem()?.valueEstimate || 0) }}
                    </span>
                  </div>
                }
              </div>

            </div>

          </div>

          <!-- Value Difference & Result Box -->
          <div class="bg-[#f2f4ee] dark:bg-emerald-950/20 rounded-[28px] p-6 sm:p-8 border border-emerald-900/10 dark:border-emerald-500/20 space-y-6 text-center shadow-sm">
            
            <div class="grid grid-cols-2 divide-x divide-emerald-900/10 dark:divide-emerald-500/20 max-w-lg mx-auto">
              <div class="pr-4">
                <span class="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  VALUE DIFFERENCE
                </span>
                <span class="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {{ formatCurrency(valueDifference()) }}
                </span>
              </div>

              <div class="pl-4">
                <span class="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  RESULT
                </span>
                <span class="block text-xl sm:text-2xl font-black text-[#2d5c2b] dark:text-emerald-400 mt-1">
                  • {{ matchResultText() }}
                </span>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Values are reasonably similar. This has a <strong class="text-slate-900 dark:text-white font-extrabold">{{ matchProbability() }}% match probability</strong> based on category and demand.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                (click)="sendSwapRequest()"
                [disabled]="!offeredItem() || submitting()"
                class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2d5c2b] hover:bg-[#234821] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Send Swap Request
              </button>
              
              <button
                (click)="messageOwnerFirst()"
                class="w-full sm:w-auto px-6 py-3.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-bold hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                Message Owner First
              </button>
            </div>

          </div>

          <!-- In-depth Comparison Section -->
          <div class="space-y-6 pt-4">
            <h3 class="text-xl sm:text-2xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight">
              In-depth Comparison
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <!-- Card 1: Market Demand -->
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
                <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  MARKET DEMAND
                </span>
                
                <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden my-2">
                  <div class="h-full bg-gradient-to-r from-emerald-600 to-[#2d5c2b] rounded-full w-[88%] relative">
                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#2d5c2b] rounded-full shadow-sm"></div>
                  </div>
                </div>

                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  High Demand for {{ offeredItem()?.category || 'Hoodie' }}
                </p>
              </div>

              <!-- Card 2: Condition Match -->
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-sm">
                <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  CONDITION MATCH
                </span>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  {{ offeredItem()?.condition || 'Excellent' }} vs {{ targetItem()?.condition || 'Like New' }}
                </p>
                <p class="text-[11px] text-slate-500">
                  Both items are well-maintained.
                </p>
              </div>

              <!-- Card 3: Original Value -->
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-sm">
                <span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  ORIGINAL VALUE
                </span>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  {{ formatCurrency((offeredItem()?.valueEstimate || 38) * 2) }} vs {{ formatCurrency((targetItem()?.valueEstimate || 42) * 2.2) }}
                </p>
                <p class="text-[11px] text-slate-500">
                  Retail price comparison.
                </p>
              </div>

            </div>
          </div>
        }

      </div>

      <!-- Change Offered Item Drawer/Modal -->
      <app-bottom-sheet
        [isOpen]="openChangeItemModal()"
        title="Select Offered Item From Your Closet"
        subtitle="Choose which garment you want to exchange for this item"
        (close)="openChangeItemModal.set(false)"
      >
        <div class="space-y-4 pt-2">
          @if (userClosetItems().length === 0) {
            <div class="text-center p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl space-y-3">
              <p class="text-xs text-slate-400">You don't have any available items in your closet.</p>
              <a
                routerLink="/items/create"
                (click)="openChangeItemModal.set(false)"
                class="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-emerald-700"
              >
                + List a Garment Now
              </a>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              @for (item of userClosetItems(); track item._id) {
                <div
                  (click)="selectOfferedItem(item)"
                  [class]="offeredItem()?._id === item._id ? 'ring-2 ring-emerald-600 bg-emerald-500/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100'"
                  class="p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3"
                >
                  <img
                    [src]="item?.images?.[0]"
                    appImageFallback
                    class="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div class="truncate flex-1">
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ item.title }}</h4>
                    <p class="text-[10px] text-slate-500 font-medium">Size {{ item.size }} · {{ item.condition }}</p>
                    <span class="text-xs font-extrabold text-emerald-600 mt-0.5 block">
                      {{ formatCurrency(item.valueEstimate) }}
                    </span>
                  </div>
                  @if (offeredItem()?._id === item._id) {
                    <span class="text-emerald-600 font-bold text-sm">✓</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      </app-bottom-sheet>

    </div>
  `,
})
export class SwapRequestComponent implements OnInit {
  private itemService = inject(ItemService);
  private swapService = inject(SwapService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  targetItem = signal<Item | null>(null);
  offeredItem = signal<Item | null>(null);
  userClosetItems = signal<Item[]>([]);
  
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  openChangeItemModal = signal<boolean>(false);

  // Dynamic fairness metrics
  valueDifference = computed(() => {
    const val1 = this.offeredItem()?.valueEstimate || 0;
    const val2 = this.targetItem()?.valueEstimate || 0;
    return Math.abs(val1 - val2);
  });

  matchProbability = computed(() => {
    const val1 = this.offeredItem()?.valueEstimate || 38;
    const val2 = this.targetItem()?.valueEstimate || 42;
    if (!val1 || !val2) return 92;
    const diffRatio = Math.abs(val1 - val2) / Math.max(val1, val2);
    const prob = Math.round((1 - diffRatio) * 100);
    return Math.max(65, Math.min(98, prob));
  });

  matchResultText = computed(() => {
    const prob = this.matchProbability();
    if (prob >= 85) return 'GREAT MATCH';
    if (prob >= 70) return 'FAIR MATCH';
    return 'UNBALANCED';
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const targetId = params.get('targetId') || this.route.snapshot.queryParamMap.get('targetId');
      if (targetId) {
        if (targetId.startsWith('demo-')) {
          this.loadDemoItems(targetId);
        } else {
          this.fetchTargetItem(targetId);
        }
      } else {
        this.loadDemoItems('demo-1');
      }
    });

    this.fetchUserCloset();
  }

  private fetchTargetItem(id: string): void {
    this.loading.set(true);
    this.itemService.getItemById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.data) {
          this.targetItem.set(res.data);
        } else {
          this.loadDemoItems('demo-1');
        }
      },
      error: () => this.loadDemoItems('demo-1'),
    });
  }

  private loadDemoItems(targetId: string): void {
    const demoItems: Record<string, Item> = {
      'demo-1': {
        _id: 'demo-1',
        title: "Levi's Denim Jacket",
        description: 'Classic dark blue wash denim trucker jacket with brass buttons.',
        category: 'Outerwear',
        size: 'M',
        brand: "Levi's",
        condition: 'Like New',
        gender: 'Unisex',
        valueEstimate: 42,
        tags: ['denim', 'jacket', 'levis'],
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-2',
          name: 'Sarah Jenkins',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        },
        status: 'AVAILABLE',
        likesCount: 15,
      },
      'demo-2': {
        _id: 'demo-2',
        title: 'Nike Vintage Hoodie',
        description: 'Black classic Nike swoosh pullover fleece hoodie in soft cotton blend.',
        category: 'Tops',
        size: 'M',
        brand: 'Nike',
        condition: 'Excellent',
        gender: 'Unisex',
        valueEstimate: 38,
        tags: ['nike', 'hoodie', 'vintage'],
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'],
        owner: {
          _id: 'user-1',
          name: 'Current User',
        },
        status: 'AVAILABLE',
        likesCount: 22,
      },
    };

    const target = demoItems[targetId] || demoItems['demo-1'];
    const offered = demoItems['demo-2'];

    this.targetItem.set(target);
    this.offeredItem.set(offered);

    this.userClosetItems.set([
      offered,
      {
        _id: 'demo-3',
        title: 'Adidas Originals Track Pants',
        description: 'Classic 3-stripe black athletic track pants.',
        category: 'Pants',
        size: 'M',
        brand: 'Adidas',
        condition: 'Like New',
        gender: 'Unisex',
        valueEstimate: 35,
        tags: ['adidas', 'pants', 'sportswear'],
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'],
        owner: { _id: 'user-1', name: 'Current User' },
        status: 'AVAILABLE',
        likesCount: 8,
      },
      {
        _id: 'demo-4',
        title: 'Zara Oversized Linen Shirt',
        description: 'Lightweight resort collar linen shirt.',
        category: 'Tops',
        size: 'L',
        brand: 'Zara',
        condition: 'New with Tags',
        gender: 'Men',
        valueEstimate: 45,
        tags: ['zara', 'linen', 'shirt'],
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'],
        owner: { _id: 'user-1', name: 'Current User' },
        status: 'AVAILABLE',
        likesCount: 12,
      },
    ]);

    this.loading.set(false);
  }

  private fetchUserCloset(): void {
    const currentUserId = this.authService.currentUser()?._id;
    if (!currentUserId) return;

    this.itemService.getItems({ ownerId: currentUserId, status: 'AVAILABLE' }).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.userClosetItems.set(res.data);
          if (!this.offeredItem()) {
            this.offeredItem.set(res.data[0]);
          }
        }
      },
    });
  }

  selectOfferedItem(item: Item): void {
    this.offeredItem.set(item);
    this.openChangeItemModal.set(false);
  }

  formatCurrency(val: number): string {
    return `₹${val}`;
  }

  sendSwapRequest(): void {
    const target = this.targetItem();
    const offered = this.offeredItem();
    if (!target || !offered) return;

    if (offered._id.startsWith('demo-') || target._id.startsWith('demo-')) {
      this.notification.success('Swap Request Sent!', `Your proposal to exchange "${offered.title}" for "${target.title}" was sent.`);
      this.router.navigate(['/swaps']);
      return;
    }

    this.submitting.set(true);
    this.swapService
      .createSwapProposal({
        requestedItemId: target._id,
        offeredItemIds: [offered._id],
        message: 'Proposed fair swap request.',
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          if (res.success) {
            this.notification.success('Swap Request Sent!', 'Your trade proposal was delivered to the item owner.');
            this.router.navigate(['/swaps']);
          }
        },
        error: (err) => {
          this.submitting.set(false);
          if (err.status === 409) {
            this.notification.warning('Active Proposal Exists', 'You already have a pending proposal for this item.');
            this.router.navigate(['/swaps']);
          } else {
            this.notification.error('Proposal Failed', err.error?.message || 'Could not submit swap proposal.');
          }
        },
      });
  }

  messageOwnerFirst(): void {
    const ownerId = this.targetItem()?.owner?._id;
    if (ownerId) {
      this.router.navigate(['/chat'], { queryParams: { userId: ownerId } });
    } else {
      this.router.navigate(['/chat']);
    }
  }
}
