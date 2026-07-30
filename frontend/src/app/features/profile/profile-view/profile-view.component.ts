import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ItemService } from '../../../core/services/item.service';
import { User } from '../../../core/models/user.model';
import { Item } from '../../../core/models/item.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingStarsComponent, ImageFallbackDirective],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 md:px-12 pb-24">
      <div class="max-w-6xl mx-auto space-y-12">
        
        <!-- Profile Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Column: Avatar with Verified Checkmark Badge -->
          <div class="lg:col-span-3 flex justify-center lg:justify-start">
            <div class="relative inline-block">
              <img
                [src]="displayUser()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
                [alt]="displayUser()?.name"
                appImageFallback
                class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-sm ring-4 ring-white dark:ring-slate-900"
              />
              <span
                class="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-900 shadow-sm"
                title="Verified Swapper"
              >
                ✓
              </span>
            </div>
          </div>

          <!-- Middle Column: Name, Location, Badges & Bio -->
          <div class="lg:col-span-5 space-y-3 text-center lg:text-left">
            <div>
              <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {{ displayUser()?.name || 'Sarah Williams' }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {{ displayUser()?.location?.city || 'East London' }} · Member since {{ getMemberYear() }}
              </p>
            </div>

            <!-- Badges Pill Row -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase">
                VERIFIED
              </span>
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase">
                TRUSTED SWAPPER
              </span>
              <span class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] tracking-wider uppercase">
                ECO CHAMPION
              </span>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl pt-1">
              {{ displayUser()?.bio || 'Sustainable fashion enthusiast. I love swapping high-quality outerwear and vintage finds. Usually looking for minimal styles and natural fabrics.' }}
            </p>
          </div>

          <!-- Right Column: Stats Card & Action CTA -->
          <div class="lg:col-span-4 space-y-4">
            
            <!-- 3-Column Stats Card -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 text-center">
              <div class="px-2">
                <span class="block text-xl font-black text-slate-900 dark:text-white">
                  {{ displayItems().length || 24 }}
                </span>
                <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                  LISTINGS
                </span>
              </div>

              <div class="px-2">
                <span class="block text-xl font-black text-slate-900 dark:text-white">
                  {{ displayUser()?.swapCount || 18 }}
                </span>
                <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                  SWAPS
                </span>
              </div>

              <div class="px-2">
                <span class="block text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  {{ (displayUser()?.ratingAverage || 4.9).toFixed(1) }} <span class="text-amber-400 text-sm">★</span>
                </span>
                <span class="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                  RATING
                </span>
              </div>
            </div>

            <!-- Action Button -->
            @if (isSelf) {
              <div class="flex items-center space-x-3">
                <a
                  routerLink="/profile/settings"
                  class="flex-1 py-3 px-4 text-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-300 transition-colors"
                >
                  ⚙️ Settings
                </a>
                <a
                  routerLink="/items/create"
                  class="flex-1 py-3 px-4 text-center rounded-full bg-[#2d5c2b] text-white font-extrabold text-xs shadow-md hover:bg-[#234821] transition-colors"
                >
                  + Add Item
                </a>
              </div>
            } @else {
              <button
                (click)="messageUser()"
                class="w-full py-3.5 px-6 rounded-full bg-[#2d5c2b] hover:bg-[#234821] text-white text-xs sm:text-sm font-extrabold shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer"
              >
                Message {{ firstName() }}
              </button>
            }

          </div>

        </div>

        <!-- Available Items Section -->
        <div class="space-y-6 pt-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Available Items
            </h2>

            <div class="flex items-center space-x-3 text-xs font-bold text-slate-400">
              <span class="text-slate-900 dark:text-white underline underline-offset-4 cursor-pointer">List View</span>
              <span>Grid View</span>
            </div>
          </div>

          @if (displayItems().length === 0) {
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200/80 dark:border-slate-800">
              No clothing items available in this closet right now.
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (item of displayItems(); track item._id) {
                <div [routerLink]="['/items', item._id]" class="group cursor-pointer block">
                  
                  <!-- Card Image Container -->
                  <div class="aspect-[4/4.5] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800/80 p-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-all shadow-inner mb-3">
                    <img
                      [src]="item?.images?.[0]"
                      [alt]="item?.title"
                      appImageFallback
                      class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    />

                    <!-- Top-Right Favorite Heart Button -->
                    <button
                      (click)="toggleFavorite($event, item)"
                      class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                      title="Save to Favorites"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-4.5-4.5h-1.586a1.5 1.5 0 01-1.06-.44l-1.414-1.414a1.5 1.5 0 00-2.12 0L7.586 6.318a1.5 1.5 0 01-1.06.44H4.318z" />
                      </svg>
                    </button>
                  </div>

                  <!-- Details -->
                  <div class="space-y-0.5">
                    <div class="flex items-center justify-between gap-2">
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {{ item.title }}
                      </h3>
                      <span class="text-sm font-extrabold text-slate-900 dark:text-white shrink-0">
                        {{ formatCurrency(item.valueEstimate) }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium">
                      {{ item.brand || 'Brand' }} · Size {{ item.size || 'M' }} · {{ item.condition || 'Like New' }}
                    </p>
                  </div>

                </div>
              }
            </div>
          }
        </div>

        <!-- Bottom Split Section: Swap History & Reviews -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
          
          <!-- Left Column: Swap History -->
          <div class="space-y-4">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Swap History
            </h3>

            <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div class="w-14 h-14 rounded-xl bg-[#f4f2ea] dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=200"
                  appImageFallback
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div class="space-y-0.5">
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#2d5c2b] dark:text-emerald-400 block">
                  SUCCESSFUL SWAP
                </span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">
                  Swapped with Marcus Chen
                </h4>
                <p class="text-[11px] text-slate-400">
                  October 5, 2024
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column: Reviews -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Reviews
              </h3>

              <button class="text-xs font-bold text-slate-500 hover:underline cursor-pointer">
                View all 18
              </button>
            </div>

            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                  appImageFallback
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h5 class="text-xs font-bold text-slate-900 dark:text-white">Marcus Chen</h5>
                  <div class="flex items-center text-amber-400 text-xs">
                    ★★★★★
                  </div>
                </div>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "Great swap! Sarah was very responsive and the jacket was in perfect condition as described. Would definitely swap again."
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
})
export class ProfileViewComponent implements OnInit {
  private authService = inject(AuthService);
  private itemService = inject(ItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = signal<User | null>(null);
  closetItems = signal<Item[]>([]);
  isSelf = false;

  displayUser = computed(() => {
    return this.user() || {
      _id: 'demo-user-1',
      name: 'Sarah Williams',
      location: { city: 'East London', country: 'UK' },
      bio: 'Sustainable fashion enthusiast. I love swapping high-quality outerwear and vintage finds. Usually looking for minimal styles and natural fabrics.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      ratingAverage: 4.9,
      swapCount: 18,
    };
  });

  displayItems = computed(() => {
    if (this.closetItems().length > 0) return this.closetItems();
    return [
      {
        _id: 'demo-1',
        title: 'Vintage Denim Jacket',
        description: 'Classic Levi denim trucker jacket.',
        category: 'Outerwear' as any,
        size: 'M',
        brand: "Levi's",
        condition: 'Like New' as any,
        gender: 'Unisex' as any,
        valueEstimate: 45,
        tags: ['denim', 'levis'],
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800'],
        owner: { _id: 'demo-user-1', name: 'Sarah Williams' },
        status: 'AVAILABLE' as any,
        likesCount: 18,
      },
      {
        _id: 'demo-2',
        title: 'Wool Knit Sweater',
        description: 'Chunky ribbed beige wool knit sweater.',
        category: 'Tops' as any,
        size: 'L',
        brand: 'COS',
        condition: 'Excellent' as any,
        gender: 'Unisex' as any,
        valueEstimate: 38,
        tags: ['wool', 'sweater', 'cos'],
        images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'],
        owner: { _id: 'demo-user-1', name: 'Sarah Williams' },
        status: 'AVAILABLE' as any,
        likesCount: 24,
      },
    ];
  });

  firstName = computed(() => {
    const name = this.displayUser()?.name || 'Sarah';
    return name.split(' ')[0];
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const targetUserId = params['userId'] || this.authService.currentUser()?._id;
      this.isSelf = !!targetUserId && targetUserId === this.authService.currentUser()?._id;

      if (targetUserId) {
        this.fetchCloset(targetUserId);
      } else {
        this.user.set(this.authService.currentUser());
      }
    });
  }

  private fetchCloset(userId: string): void {
    this.itemService.getItems({ ownerId: userId }).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.closetItems.set(res.data);
          if (!this.isSelf) {
            this.user.set(res.data[0].owner);
          }
        }
      },
    });
  }

  getMemberYear(): string {
    return '2024';
  }

  formatCurrency(val: number): string {
    return `₹${val}`;
  }

  toggleFavorite(event: Event, item: Item): void {
    event.stopPropagation();
    event.preventDefault();
  }

  messageUser(): void {
    const targetId = this.displayUser()?._id;
    if (targetId) {
      this.router.navigate(['/chat'], { queryParams: { userId: targetId } });
    } else {
      this.router.navigate(['/chat']);
    }
  }
}
