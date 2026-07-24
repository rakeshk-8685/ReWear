import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ItemService } from '../../../core/services/item.service';
import { User } from '../../../core/models/user.model';
import { Item } from '../../../core/models/item.model';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemCardComponent, RatingStarsComponent],
  template: `
    <div class="space-y-12">
      
      <!-- User Profile Header Card -->
      <div class="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div class="relative">
            <img
              [src]="user()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
              class="w-28 h-28 rounded-full object-cover ring-4 ring-emerald-500/40 shadow-xl"
            />
            <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] shadow-md border border-white/40">
              Lvl 12
            </span>
          </div>

          <div class="flex-1 text-center md:text-left space-y-3">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div class="flex items-center space-x-2 justify-center md:justify-start">
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{{ user()?.name }}</h1>
                  <span class="text-emerald-500 text-sm" title="Verified Profile">✓</span>
                </div>
                <p class="text-xs text-slate-400 font-medium">📍 {{ user()?.location?.city || 'Bangalore' }}, {{ user()?.location?.country || 'India' }} • <span class="text-emerald-400 font-bold">#4 Top Swapper</span></p>
              </div>

              <div class="flex items-center space-x-2">
                @if (isSelf) {
                  <a routerLink="/profile/settings" class="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200">
                    ⚙️ Settings
                  </a>
                  <a routerLink="/items/create" class="px-5 py-2 rounded-full btn-primary text-xs shadow-md">
                    + Add Item
                  </a>
                }
              </div>
            </div>

            <!-- Gamification Level & XP Progress Meter Bar -->
            <div class="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div class="flex items-center justify-between text-[11px] font-bold">
                <span class="text-emerald-400">Swapper Master • Level 12</span>
                <span class="text-slate-400">1,450 / 2,000 XP</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[72.5%] transition-all duration-500"></div>
              </div>
            </div>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {{ user()?.bio || 'Sustainable fashion advocate & vintage denim collector based in Indiranagar, Bangalore.' }}
            </p>

            <!-- Stats & Profile Achievement Medals Grid -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <span class="text-xs font-bold text-slate-400">Rating:</span>
                <app-rating-stars [rating]="user()?.ratingAverage || 5" [readonly]="true" />
              </div>

              <div class="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                🔄 {{ user()?.swapCount || 14 }} Swaps Completed
              </div>

              <div class="px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
                🏆 Eco Champion Medal
              </div>

              <div class="px-3.5 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                ⚡ 24h Fast Shipper
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Closet & Saved Wishlist Tabs -->
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-4">
            <button
              (click)="activeTab.set('closet')"
              [class]="activeTab() === 'closet' ? 'text-emerald-500 border-b-2 border-emerald-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'"
              class="pb-2 text-base tracking-tight transition-colors"
            >
              Closet Showcase ({{ closetItems().length }})
            </button>

            @if (isSelf) {
              <button
                (click)="activeTab.set('wishlist')"
                [class]="activeTab() === 'wishlist' ? 'text-emerald-500 border-b-2 border-emerald-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'"
                class="pb-2 text-base tracking-tight transition-colors"
              >
                Saved Wishlist ❤️ ({{ wishlistItems().length }})
              </button>
            }
          </div>
        </div>

        @if (activeTab() === 'closet') {
          @if (closetItems().length === 0) {
            <div class="text-center py-12 glass-card rounded-3xl p-8 text-slate-400 text-sm">
              No clothing listings available in this closet right now.
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (item of closetItems(); track item._id) {
                <app-item-card [item]="item" />
              }
            </div>
          }
        } @else {
          <!-- Wishlist & Collection Folders Tab -->
          <div class="space-y-6">
            <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                (click)="selectedCollection.set('All')"
                [class]="selectedCollection() === 'All' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'"
                class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0"
              >
                📁 All Saved Items
              </button>
              <button
                (click)="selectedCollection.set('Denim')"
                [class]="selectedCollection() === 'Denim' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'"
                class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0"
              >
                📁 Vintage Denim Edit
              </button>
              <button
                (click)="selectedCollection.set('Linen')"
                [class]="selectedCollection() === 'Linen' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'"
                class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0"
              >
                📁 Summer Linens
              </button>
            </div>

            @if (wishlistItems().length === 0) {
              <div class="text-center py-12 glass-card rounded-3xl p-8 text-slate-400 text-sm">
                You haven't saved any items to your wishlist yet! Click the heart icon on items you love.
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (item of wishlistItems(); track item._id) {
                  <app-item-card [item]="item" />
                }
              </div>
            }
          </div>
        }
      </div>

    </div>
  `,
})
export class ProfileViewComponent implements OnInit {
  private authService = inject(AuthService);
  private itemService = inject(ItemService);
  private route = inject(ActivatedRoute);

  user = signal<User | null>(null);
  closetItems = signal<Item[]>([]);
  wishlistItems = signal<Item[]>([]);
  activeTab = signal<'closet' | 'wishlist'>('closet');
  selectedCollection = signal<string>('All');
  isSelf = false;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const targetUserId = params['userId'] || this.authService.currentUser()?._id;
      this.isSelf = targetUserId === this.authService.currentUser()?._id;

      if (this.isSelf && this.authService.currentUser()) {
        this.user.set(this.authService.currentUser());
        this.fetchCloset(targetUserId);
        this.fetchWishlist();
      } else if (targetUserId) {
        this.fetchCloset(targetUserId);
      }
    });
  }

  private fetchCloset(userId: string): void {
    this.itemService.getItems({ ownerId: userId }).subscribe({
      next: (res) => {
        if (res.data) {
          this.closetItems.set(res.data);
          if (!this.isSelf && res.data.length > 0) {
            this.user.set(res.data[0].owner);
          }
        }
      },
    });
  }

  private fetchWishlist(): void {
    this.itemService.getItems().subscribe({
      next: (res) => {
        if (res.data) {
          const currentUserId = this.authService.currentUser()?._id;
          const liked = res.data.filter((item) => item.likedBy && item.likedBy.includes(currentUserId!));
          this.wishlistItems.set(liked);
        }
      },
    });
  }
}
