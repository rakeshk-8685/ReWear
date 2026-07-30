import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../core/services/item.service';
import { Item } from '../../core/models/item.model';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ItemCardComponent, RatingStarsComponent],
  template: `
    <div class="space-y-24">
      
      <!-- Section 1: Hero Section (Apple / Framer / Stripe aesthetic) -->
      <section class="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 sm:p-16 border border-slate-800 shadow-2xl">
        <!-- Ambient Glowing Orbs -->
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none animate-pulse-subtle"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column: Headline & CTAs -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>The #1 Peer-to-Peer Clothing Swap Marketplace</span>
            </div>

            <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
              Swap Clothes. <br />
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Zero Money. Pure Style.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Exchange vintage jackets, Nike hoodies, Levi's jeans, and Zara linen pieces directly with swappers across Bangalore, Mumbai, Delhi, and Noida.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-2">
              <a
                routerLink="/items/create"
                class="px-8 py-4 rounded-full btn-primary text-sm shadow-xl flex items-center space-x-2"
              >
                <span>+ List Clothing Garment</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l7-7m-7 7H3" />
                </svg>
              </a>

              <a
                routerLink="/items"
                class="px-8 py-4 rounded-full btn-secondary text-sm"
              >
                Browse Marketplace Feed
              </a>
            </div>

            <!-- Recently Online Swappers with Verified Reputation Badges -->
            <div class="flex items-center space-x-4 pt-4 border-t border-white/10">
              <div class="flex -space-x-3">
                @for (user of onlineUsers; track user.name) {
                  <div class="relative group">
                    <img [src]="user.avatar" [alt]="user.name" class="w-9 h-9 rounded-full ring-2 ring-slate-900 object-cover" />
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900 animate-pulse"></span>
                  </div>
                }
              </div>
              <div class="text-xs">
                <div class="flex items-center space-x-1.5 text-amber-400">
                  <span class="font-bold">★ 4.98 Reputation</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">🏆 Verified Swapper</span>
                </div>
                <p class="text-slate-300 font-medium">84 swappers active in Bangalore & Mumbai right now</p>
              </div>
            </div>

          </div>

          <!-- Right Column: Floating 3D Glass Hero Card -->
          <div class="lg:col-span-5 relative">
            <div class="apple-glass-card rounded-4xl p-6 border border-white/20 shadow-2xl space-y-4">
              <div class="relative aspect-square rounded-3xl overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
                  alt="Nike Sports Hoodie"
                  class="w-full h-full object-cover"
                />
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider">
                  Like New
                </span>
                <span class="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md">
                  Size: L • Est. ~₹1,400 • Bangalore
                </span>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase">
                  <span>Nike Sports Hoodie</span>
                  <span>1:1 Trade Offer</span>
                </div>
                <h3 class="text-lg font-bold text-white">Nike Fleece Pullover Hoodie</h3>
                <p class="text-xs text-slate-300">Offered by Aarav S. in exchange for Levi's 501 Jeans</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Section 2: Live Community Stats Telemetry Bar -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-3xl text-center space-y-1 border border-slate-200 dark:border-slate-800">
          <h3 class="text-3xl sm:text-4xl font-black text-emerald-500">14,250 kg</h3>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">CO2 Emissions Saved</p>
        </div>
        <div class="glass-card p-6 rounded-3xl text-center space-y-1 border border-slate-200 dark:border-slate-800">
          <h3 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">8,920+</h3>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Garments Swapped</p>
        </div>
        <div class="glass-card p-6 rounded-3xl text-center space-y-1 border border-slate-200 dark:border-slate-800">
          <h3 class="text-3xl sm:text-4xl font-black text-emerald-500">₹0</h3>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Peer Cash Transactions</p>
        </div>
        <div class="glass-card p-6 rounded-3xl text-center space-y-1 border border-slate-200 dark:border-slate-800">
          <h3 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">99.4%</h3>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Successful Exchange Rate</p>
        </div>
      </section>

      <!-- Section 3: Today's Picks Showcase -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Today's Featured Picks</h2>
            <p class="text-sm text-slate-500">Hand-selected pre-loved apparel available for swap</p>
          </div>
          <a routerLink="/items" class="text-xs font-bold text-emerald-500 hover:underline">View All Feed ➔</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (item of featuredItems(); track item._id + '-' + $index) {
            <app-item-card [item]="item" />
          }
        </div>
      </section>

      <!-- Section 4: Featured Curated Collections & Seasonal Picks -->
      <section class="space-y-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Featured Collections & Seasonal Picks</h2>
          <p class="text-sm text-slate-500">Curated apparel edits selected by our community fashion directors</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (col of collections; track col.title) {
            <a [routerLink]="['/items']" [queryParams]="{ category: col.category }" class="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 shadow-xl cursor-pointer block">
              <img [src]="col.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <span class="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider w-fit mb-2">
                  {{ col.badge }}
                </span>
                <h3 class="text-xl font-black text-white leading-snug">{{ col.title }}</h3>
                <p class="text-xs text-slate-300 mt-1">{{ col.itemCount }} curated items available</p>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Section 5: Trending Swaps Live Negotiation Preview -->
      <section class="space-y-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Recently Completed & Trending Swaps</h2>
          <p class="text-sm text-slate-500">Recent clothing trades negotiated between community members</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (trade of trendingSwaps; track trade.id) {
            <div class="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center space-x-2">
                  <img [src]="trade.requesterAvatar" class="w-8 h-8 rounded-full object-cover" />
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ trade.requesterName }}</span>
                  <span class="text-emerald-500 font-bold">⇄</span>
                  <img [src]="trade.receiverAvatar" class="w-8 h-8 rounded-full object-cover" />
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ trade.receiverName }}</span>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {{ trade.status }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl">
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400">Offered</span>
                  <p class="font-bold text-slate-800 dark:text-slate-200">{{ trade.offeredTitle }}</p>
                </div>
                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-emerald-500">Requested</span>
                  <p class="font-bold text-slate-800 dark:text-slate-200">{{ trade.requestedTitle }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Section 6: Popular Categories Grid -->
      <section class="space-y-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shop by Popular Category</h2>
          <p class="text-sm text-slate-500">Discover clothes tailored to your style</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          @for (cat of categories; track cat.name) {
            <a
              routerLink="/items"
              [queryParams]="{ category: cat.name }"
              class="glass-card p-5 rounded-3xl text-center space-y-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all group"
            >
              <div class="text-3xl group-hover:scale-125 transition-transform duration-300">{{ cat.icon }}</div>
              <h4 class="text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">{{ cat.name }}</h4>
              <span class="text-[10px] text-slate-400">{{ cat.count }} items</span>
            </a>
          }
        </div>
      </section>

      <!-- Section 7: Nearby Local Swaps (Indian Cities) -->
      <section class="space-y-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Nearby Local Swaps</h2>
          <p class="text-sm text-slate-500">Clothing items available for exchange near your city</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          @for (item of nearbyItems; track item.title) {
            <a [routerLink]="['/items']" class="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 block hover:border-emerald-500 transition-all">
              <div class="aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
                <img [src]="item.image" class="w-full h-full object-cover" />
                <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white font-bold text-[10px]">
                  📍 {{ item.distance }} • {{ item.city }}
                </span>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{{ item.title }}</h4>
                <p class="text-xs text-slate-400">{{ item.brand }} • Size: {{ item.size }}</p>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Section 8: Swapper Testimonials -->
      <section class="space-y-6">
        <div class="text-center space-y-2 max-w-xl mx-auto">
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">Loved by Sustainable Swappers</h2>
          <p class="text-sm text-slate-500">Real feedback from verified ReWear community members</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (review of testimonials; track review.name) {
            <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <app-rating-stars [rating]="review.rating" [readonly]="true" />
              <p class="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{{ review.comment }}"
              </p>
              <div class="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <img [src]="review.avatar" class="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ review.name }}</h4>
                  <p class="text-[10px] text-slate-400">{{ review.role }} • {{ review.city }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Section 9: Final Call to Action Hero Banner -->
      <section class="p-12 rounded-4xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white text-center space-y-6 shadow-2xl">
        <h2 class="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
          Ready to Refresh Your Closet Without Spending Money?
        </h2>
        <p class="text-sm sm:text-base text-emerald-100 max-w-md mx-auto">
          Join thousands of sustainable fashion lovers today. List your pre-loved clothes in 60 seconds.
        </p>
        <div class="pt-2">
          <a
            routerLink="/auth/register"
            class="inline-block px-8 py-4 rounded-full bg-white text-slate-900 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Create Free ReWear Account
          </a>
        </div>
      </section>

    </div>
  `,
})
export class LandingPageComponent implements OnInit {
  private itemService = inject(ItemService);

  featuredItems = signal<Item[]>([]);

  onlineUsers = [
    { name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ananya Kapoor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  ];

  collections = [
    { title: 'Spring Vintage Denim & Outerwear', category: 'Vintage', badge: 'Featured Edit', itemCount: 42, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800' },
    { title: 'Minimalist Pure Organic Linen', category: 'Tops', badge: 'Summer Essential', itemCount: 28, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800' },
    { title: 'Urban Streetwear Hoodies & Kicks', category: 'Outerwear', badge: 'Trending Now', itemCount: 56, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800' },
  ];

  categories = [
    { name: 'Tops', icon: '👕', count: '2,890+' },
    { name: 'Pants', icon: '👖', count: '1,940+' },
    { name: 'Outerwear', icon: '🧥', count: '1,560+' },
    { name: 'Dresses', icon: '👗', count: '980+' },
    { name: 'Shoes', icon: '👟', count: '1,120+' },
    { name: 'Accessories', icon: '🎒', count: '870+' },
  ];

  trendingSwaps = [
    {
      id: 1,
      requesterName: 'Aarav Sharma',
      requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      receiverName: 'Rohan Gupta',
      receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      offeredTitle: 'Nike Sports Hoodie',
      requestedTitle: "Levi's 501 Jeans",
      status: 'SWAP COMPLETED',
    },
    {
      id: 2,
      requesterName: 'Ananya Kapoor',
      requesterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      receiverName: 'Priya Patel',
      receiverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      offeredTitle: 'Zara Linen Shirt',
      requestedTitle: 'Uniqlo Light Down Jacket',
      status: 'OFFER ACCEPTED',
    },
  ];

  nearbyItems = [
    { title: 'Nike Sports Hoodie', brand: 'Nike', size: 'L', distance: '1.2 km away', city: 'Indiranagar, Bangalore', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600' },
    { title: "Levi's 501 Jeans", brand: "Levi's", size: '32x32', distance: '2.5 km away', city: 'Bandra, Mumbai', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600' },
    { title: 'Zara Linen Shirt', brand: 'Zara', size: 'M', distance: '3.1 km away', city: 'Sector 18, Noida', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600' },
  ];

  testimonials = [
    { name: 'Aarav Sharma', role: 'Vintage Collector', city: 'Bangalore', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', rating: 5, comment: 'ReWear completely changed how I refresh my wardrobe. I swapped two Nike hoodies I barely wore for vintage denim without spending a single rupee!' },
    { name: 'Rohan Gupta', role: 'Streetwear Swapper', city: 'Mumbai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', rating: 5, comment: 'The 1:1 trade proposal UI and real-time chat make swapping feel effortless. The community trust ratings ensure safe courier delivery every time.' },
    { name: 'Ananya Kapoor', role: 'Eco Fashion Blogger', city: 'Noida', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', rating: 5, comment: 'I love seeing how many kilograms of CO2 I save with every swap. ReWear makes sustainable circular fashion genuinely fun and rewarding.' },
  ];

  ngOnInit() {
    this.itemService.getItems({ limit: 4 }).subscribe({
      next: (res: any) => {
        if (res?.data && res.data.length > 0) {
          this.featuredItems.set(res.data);
        } else {
          this.setFallbackFeaturedItems();
        }
      },
      error: () => {
        this.setFallbackFeaturedItems();
      },
    });
  }

  private setFallbackFeaturedItems(): void {
    this.featuredItems.set([
      {
        _id: 'demo-1',
        title: 'Vintage 90s Leather Biker Jacket',
        description: 'Authentic distressed dark brown genuine leather jacket with heavy zippers.',
        category: 'Vintage',
        size: 'L',
        condition: 'Like New',
        brand: 'Schott NYC',
        gender: 'Unisex',
        valueEstimate: 180,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'],
        status: 'AVAILABLE',
        likesCount: 24,
        viewsCount: 189,
        uploaderId: 'user-1',
      } as any,
      {
        _id: 'demo-2',
        title: 'Nike Fleece Pullover Hoodie',
        description: 'Heavyweight organic cotton hoodie in emerald sage green.',
        category: 'Tops',
        size: 'M',
        condition: 'Like New',
        brand: 'Nike',
        gender: 'Unisex',
        valueEstimate: 95,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'],
        status: 'AVAILABLE',
        likesCount: 18,
        viewsCount: 142,
        uploaderId: 'user-2',
      } as any,
      {
        _id: 'demo-3',
        title: "Levi's 501 Original Straight Jeans",
        description: 'Classic indigo blue wash denim with raw hem details.',
        category: 'Pants',
        size: '32/32',
        condition: 'Pristine',
        brand: "Levi's",
        gender: 'Men',
        valueEstimate: 110,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600'],
        status: 'AVAILABLE',
        likesCount: 31,
        viewsCount: 215,
        uploaderId: 'user-3',
      } as any,
      {
        _id: 'demo-4',
        title: 'Zara Oversized Pure Linen Shirt',
        description: 'Lightweight breathable resort collar linen shirt.',
        category: 'Tops',
        size: 'S',
        condition: 'New with Tags',
        brand: 'Zara',
        gender: 'Women',
        valueEstimate: 65,
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600'],
        status: 'AVAILABLE',
        likesCount: 15,
        viewsCount: 98,
        uploaderId: 'user-4',
      } as any,
    ]);
  }
}
