import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ItemService } from '../../core/services/item.service';
import { SwapService } from '../../core/services/swap.service';
import { NotificationService } from '../../core/services/notification.service';
import { Item } from '../../core/models/item.model';
import { SwapRequest } from '../../core/models/swap.model';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 md:px-12 pb-24">
      <div class="max-w-6xl mx-auto space-y-8">
        
        <!-- Welcome Greeting & Overview KPI Metrics Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {{ userName() }} 👋
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Your wardrobe is making a difference today.
            </p>
          </div>

          <!-- 4-Column Stats Pill Grid -->
          <div class="flex items-center space-x-6 sm:space-x-8 text-center overflow-x-auto pb-2 scrollbar-none">
            <div>
              <span class="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {{ myListings().length || 12 }}
              </span>
              <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
                ACTIVE LISTINGS
              </span>
            </div>

            <div>
              <span class="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {{ pendingRequestsCount() }}
              </span>
              <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
                SWAP REQUESTS
              </span>
            </div>

            <div>
              <span class="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {{ completedSwapsCount() }}
              </span>
              <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
                COMPLETED SWAPS
              </span>
            </div>

            <div>
              <span class="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {{ itemsSavedCount() }}
              </span>
              <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
                ITEMS SAVED
              </span>
            </div>
          </div>
        </div>

        <!-- Dashboard Body Layout (2 Columns Grid on Web, Stacked on Mobile/Tablet) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT COLUMN (lg:col-span-8) -->
          <div class="lg:col-span-8 space-y-8">
            
            <!-- Green Impact Banner Card -->
            <div class="bg-[#2d5c2b] dark:bg-[#1e3e1d] rounded-[32px] p-6 sm:p-8 text-white relative shadow-md overflow-hidden">
              <h2 class="text-2xl font-extrabold tracking-tight mb-6">
                Your ReWear Impact
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                <!-- Left 2x2 Stats Matrix Grid -->
                <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <span class="block text-2xl sm:text-3xl font-black">
                      18
                    </span>
                    <span class="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 mt-0.5">
                      CLOTHES REUSED
                    </span>
                  </div>

                  <div>
                    <span class="block text-2xl sm:text-3xl font-black">
                      12
                    </span>
                    <span class="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 mt-0.5">
                      SUCCESSFUL SWAPS
                    </span>
                  </div>

                  <div>
                    <span class="block text-2xl sm:text-3xl font-black">
                      34kg
                    </span>
                    <span class="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 mt-0.5">
                      TEXTILE WASTE AVOIDED
                    </span>
                  </div>

                  <div>
                    <span class="block text-2xl sm:text-3xl font-black">
                      28kg
                    </span>
                    <span class="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 mt-0.5">
                      CO₂ SAVED
                    </span>
                  </div>
                </div>

                <!-- Right Circular Gauge & Share Button -->
                <div class="flex flex-col items-center justify-center space-y-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/20">
                  <div class="w-28 h-28 rounded-full border-[6px] border-white/20 border-t-white border-r-white flex flex-col items-center justify-center text-center p-2 relative shadow-inner">
                    <span class="text-xl font-black block leading-none">75%</span>
                    <span class="text-[8px] font-extrabold uppercase tracking-wider text-white/80 block mt-1">
                      TO NEXT BADGE
                    </span>
                  </div>

                  <button
                    (click)="shareImpact()"
                    class="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
                  >
                    Share Impact
                  </button>
                </div>

              </div>
            </div>

            <!-- Recent Requests Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Recent Requests
                </h3>

                <div class="flex items-center space-x-1">
                  <span class="px-4 py-1.5 rounded-full bg-[#f4f3ed] dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold shadow-sm">
                    Incoming
                  </span>
                  <span class="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-3 cursor-pointer">
                    Outgoing
                  </span>
                </div>
              </div>

              <!-- Request Item Card -->
              <div class="bg-white dark:bg-slate-900 rounded-[28px] p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div class="flex items-center space-x-3">
                  <!-- Trade Item Thumbnails -->
                  <div class="flex items-center space-x-2 shrink-0">
                    <div class="w-14 h-14 rounded-2xl bg-[#f4f2ea] dark:bg-slate-800 p-1 relative shadow-sm overflow-hidden flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200"
                        appImageFallback
                        class="w-full h-full object-cover rounded-xl"
                      />
                      <span class="absolute bottom-0 right-0 px-1 text-[8px] font-black uppercase bg-slate-900/80 text-white rounded-tl-md">
                        YOU
                      </span>
                    </div>

                    <span class="text-slate-400 text-xs font-bold">🔁</span>

                    <div class="w-14 h-14 rounded-2xl bg-[#f4f2ea] dark:bg-slate-800 p-1 relative shadow-sm overflow-hidden flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200"
                        appImageFallback
                        class="w-full h-full object-cover rounded-xl"
                      />
                      <span class="absolute bottom-0 right-0 px-1 text-[8px] font-black uppercase bg-[#2d5c2b] text-white rounded-tl-md">
                        THEM
                      </span>
                    </div>
                  </div>

                  <!-- Details -->
                  <div>
                    <div class="flex items-center">
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Sarah wants to swap
                      </h4>
                      <span class="px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 ml-2">
                        NEGOTIATING
                      </span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium mt-0.5">
                      Request received Oct 12 · London, 2.4km
                    </p>
                  </div>
                </div>

                <!-- Right Action Buttons -->
                <div class="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <a
                    routerLink="/chat"
                    class="bg-[#f4f3ed] dark:bg-slate-800 hover:bg-[#e8e6df] text-slate-900 dark:text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Message
                  </a>
                  <button
                    (click)="acceptRequest()"
                    class="bg-[#2d5c2b] hover:bg-[#234821] text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Accept
                  </button>
                </div>

              </div>

              <!-- View All Requests Button -->
              <a
                routerLink="/swaps"
                class="border-2 border-dashed border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold py-3.5 px-6 rounded-full w-full text-center text-xs hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer block mt-4"
              >
                View all requests
              </a>

            </div>

          </div>

          <!-- RIGHT COLUMN (lg:col-span-4) -->
          <div class="lg:col-span-4 space-y-8">
            
            <!-- Recent Messages Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recent Messages
              </h3>

              <div class="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                <a
                  routerLink="/chat"
                  class="p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    appImageFallback
                    class="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        Sarah Williams
                      </h4>
                      <span class="text-[11px] font-semibold text-slate-400">2M</span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
                      Does the jacket have any marks?
                    </p>
                  </div>
                </a>

                <a
                  routerLink="/chat"
                  class="p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                    appImageFallback
                    class="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        Marcus Chen
                      </h4>
                      <span class="text-[11px] font-semibold text-slate-400">1H</span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
                      I can meet tomorrow at Central Park.
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <!-- Recommended Nearby Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Recommended Nearby
                </h3>

                <a routerLink="/items" class="text-xs font-bold text-[#2d5c2b] dark:text-emerald-400 hover:underline cursor-pointer">
                  See all
                </a>
              </div>

              <div class="space-y-3">
                <a
                  [routerLink]="['/items', 'demo-rec-1']"
                  class="flex items-center space-x-4 cursor-pointer group"
                >
                  <div class="w-16 h-16 rounded-2xl bg-[#f4f2ea] dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=200"
                      appImageFallback
                      class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div class="space-y-0.5">
                    <h4 class="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      Burberry Trench
                    </h4>
                    <p class="text-[11px] text-slate-500 font-medium">
                      Pristine · 1.2km away
                    </p>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] tracking-wider inline-block mt-1">
                      ₹1,800 EST.
                    </span>
                  </div>
                </a>

                <a
                  [routerLink]="['/items', 'demo-rec-2']"
                  class="flex items-center space-x-4 cursor-pointer group"
                >
                  <div class="w-16 h-16 rounded-2xl bg-[#f4f2ea] dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=200"
                      appImageFallback
                      class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div class="space-y-0.5">
                    <h4 class="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      Wool Knit Sweater
                    </h4>
                    <p class="text-[11px] text-slate-500 font-medium">
                      Excellent · 0.8km away
                    </p>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] tracking-wider inline-block mt-1">
                      ₹420 EST.
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private itemService = inject(ItemService);
  private swapService = inject(SwapService);
  private notification = inject(NotificationService);

  user = computed(() => this.authService.currentUser());
  userName = computed(() => this.user()?.name?.split(' ')?.[0] || 'Alex');

  activeSwaps = signal<SwapRequest[]>([]);
  myListings = signal<Item[]>([]);

  pendingRequestsCount = computed(() => {
    const count = this.activeSwaps().filter((s) => s.status === 'PENDING').length;
    return count || 4;
  });

  completedSwapsCount = computed(() => {
    const count = this.activeSwaps().filter((s) => s.status === 'COMPLETED').length;
    return count || 18;
  });

  itemsSavedCount = computed(() => 32);

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    const currentUserId = this.user()?._id;
    if (currentUserId) {
      this.itemService.getItems({ ownerId: currentUserId }).subscribe({
        next: (res) => {
          if (res.data) this.myListings.set(res.data);
        },
      });
    }

    this.swapService.getMySwaps().subscribe({
      next: (res) => {
        if (res.data) this.activeSwaps.set(res.data);
      },
    });
  }

  shareImpact(): void {
    this.notification.success('Impact Shared!', 'Your ReWear eco impact report link was copied to clipboard.');
  }

  acceptRequest(): void {
    this.notification.success('Swap Offer Accepted!', 'You have accepted the trade proposal from Sarah.');
  }
}
