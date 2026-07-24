import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ItemService } from '../../core/services/item.service';
import { SwapService } from '../../core/services/swap.service';
import { Item } from '../../core/models/item.model';
import { SwapRequest } from '../../core/models/swap.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex min-h-[calc(100vh-8rem)] rounded-4xl overflow-hidden bg-slate-900/90 text-white border border-slate-800 shadow-2xl relative">
      
      <!-- Collapsible Apple HIG Sidebar -->
      <aside
        [class]="sidebarCollapsed() ? 'w-20' : 'w-64'"
        class="bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-all duration-300 relative z-20"
      >
        <div class="space-y-6">
          <!-- Sidebar Header & Collapse Toggle -->
          <div class="flex items-center justify-between px-2">
            @if (!sidebarCollapsed()) {
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 class="text-sm font-extrabold text-white tracking-wider uppercase">ReWear Pro</h3>
              </div>
            }
            <button
              (click)="sidebarCollapsed.set(!sidebarCollapsed())"
              class="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors mx-auto"
            >
              {{ sidebarCollapsed() ? '⏩' : '⏪' }}
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1.5">
            @for (link of navLinks; track link.route) {
              <a
                [routerLink]="link.route"
                routerLinkActive="bg-emerald-500/20 text-emerald-400 border-l-4 border-emerald-500"
                class="flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <span class="text-base">{{ link.icon }}</span>
                @if (!sidebarCollapsed()) {
                  <span>{{ link.label }}</span>
                }
              </a>
            }
          </nav>
        </div>

        <!-- Sidebar Bottom User Karma Card -->
        <div class="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div class="flex items-center space-x-3">
            <img [src]="user()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'" class="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0" />
            @if (!sidebarCollapsed()) {
              <div class="truncate">
                <p class="text-xs font-bold text-white truncate">{{ user()?.name }}</p>
                <span class="text-[10px] text-emerald-400 font-bold">★ 4.9 Karma Tier</span>
              </div>
            }
          </div>
        </div>
      </aside>

      <!-- Main Dashboard Workspace Content -->
      <main class="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-none">
        
        <!-- Welcome Banner with Personalized Greeting -->
        <div class="p-8 rounded-3xl bg-gradient-to-r from-emerald-900/50 via-teal-900/40 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div class="space-y-1">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
              SaaS Swapper Hub
            </span>
            <h1 class="text-3xl font-black text-white tracking-tight">Welcome back, {{ user()?.name || 'Aarav' }}! 👋</h1>
            <p class="text-xs text-slate-300">You have <span class="text-emerald-400 font-bold">2 active trade offers</span> and 3 unread messages waiting in Bangalore.</p>
          </div>

          <div class="flex items-center space-x-3">
            <a routerLink="/items/create" class="px-6 py-3 rounded-full btn-primary text-xs shadow-lg">
              + Post New Garment
            </a>
          </div>
        </div>

        <!-- Quick Stats KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <a routerLink="/items" class="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-2 block hover:border-emerald-500/80 transition-all cursor-pointer">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listed Garments</span>
            <h3 class="text-3xl font-black text-white">{{ myListings().length || 4 }}</h3>
            <p class="text-[11px] text-emerald-400 font-medium">In active circulation ➔</p>
          </a>

          <a routerLink="/swaps" class="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-2 block hover:border-amber-500/80 transition-all cursor-pointer">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Trade Pipeline</span>
            <h3 class="text-3xl font-black text-amber-400">{{ activeSwaps().length || 2 }}</h3>
            <p class="text-[11px] text-amber-300 font-medium">Proposals pending & accepted ➔</p>
          </a>

          <a routerLink="/chat" class="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-2 block hover:border-cyan-500/80 transition-all cursor-pointer">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unread Messages</span>
            <h3 class="text-3xl font-black text-cyan-400">{{ unreadMessagesCount() }}</h3>
            <p class="text-[11px] text-cyan-300 font-medium">Direct chats with swappers ➔</p>
          </a>

          <a routerLink="/sustainability" class="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 block hover:border-emerald-400 transition-all cursor-pointer">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Total Eco CO2 Saved</span>
            <h3 class="text-3xl font-black text-emerald-300">14.2 kg</h3>
            <p class="text-[11px] text-emerald-400 font-medium">Textile waste prevented ➔</p>
          </a>
        </div>

        <!-- Weekly Activity Performance Chart Card -->
        <div class="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Weekly Swap Activity & Profile Views</h3>
              <p class="text-xs text-slate-400">Total views and swap proposal interactions over the last 7 days</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">+28% Growth</span>
          </div>

          <div class="h-44 w-full flex items-end justify-between space-x-2 pt-4 px-2">
            @for (bar of weeklyActivityData; track bar.day) {
              <div class="flex-1 flex flex-col items-center space-y-2 group">
                <div class="w-full bg-slate-900/80 rounded-t-xl h-32 flex items-end p-1">
                  <div
                    [style.height.%]="bar.height"
                    class="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-teal-300 transition-all"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-slate-400">{{ bar.day }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Profile Completion Progress Meter Card -->
        <div class="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Closet Profile Completion</h3>
              <p class="text-xs text-slate-400">Complete your profile details to boost trade proposal response rates</p>
            </div>
            <span class="text-xl font-black text-emerald-400">{{ profileCompletion() }}%</span>
          </div>

          <div class="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div
              class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              [style.width.%]="profileCompletion()"
            ></div>
          </div>
        </div>

        <!-- Active Swap Proposals & Action Center -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Pending & Active Swap Offers</h3>
            <a routerLink="/swaps" class="text-xs font-bold text-emerald-400 hover:underline">View All Trade Center ➔</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-3">
              <div class="flex items-center justify-between border-b border-slate-700 pb-2">
                <span class="text-xs font-bold text-slate-300">Offer ID: #849201</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACCEPTED
                </span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <div>
                  <span class="text-[10px] uppercase text-slate-400 block font-bold">You Get</span>
                  <span class="font-bold text-emerald-400">Nike Sports Hoodie</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] uppercase text-slate-400 block font-bold">You Give</span>
                  <span class="font-bold text-white">Levi's 501 Jeans</span>
                </div>
              </div>

              <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-700/60">
                <a routerLink="/chat" class="px-3.5 py-1.5 rounded-full bg-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-600 transition-colors">
                  💬 Message Rohan
                </a>
              </div>
            </div>

            <div class="p-5 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-3">
              <div class="flex items-center justify-between border-b border-slate-700 pb-2">
                <span class="text-xs font-bold text-slate-300">Offer ID: #910283</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PENDING OFFER
                </span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <div>
                  <span class="text-[10px] uppercase text-slate-400 block font-bold">You Get</span>
                  <span class="font-bold text-emerald-400">Zara Linen Shirt</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] uppercase text-slate-400 block font-bold">You Give</span>
                  <span class="font-bold text-white">Puma Sweatshirt</span>
                </div>
              </div>

              <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-700/60">
                <a routerLink="/chat" class="px-3.5 py-1.5 rounded-full bg-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-600 transition-colors">
                  💬 Message Ananya
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed Chronological Timeline -->
        <div class="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <h3 class="text-lg font-bold text-white">Recent Activity Stream</h3>
          <div class="space-y-3">
            @for (act of activityFeed(); track act.id) {
              <div class="flex items-center space-x-3 text-xs p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span class="text-lg">{{ act.icon }}</span>
                <div class="flex-1">
                  <p class="text-slate-200 font-bold">{{ act.title }}</p>
                  <span class="text-[10px] text-slate-400">{{ act.time }}</span>
                </div>
              </div>
            }
          </div>
        </div>

      </main>

    </div>
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private itemService = inject(ItemService);
  private swapService = inject(SwapService);

  sidebarCollapsed = signal<boolean>(false);
  user = computed(() => this.authService.currentUser());

  activeSwaps = signal<SwapRequest[]>([]);
  myListings = signal<Item[]>([]);
  suggestedSwaps = signal<Item[]>([]);
  unreadMessagesCount = signal<number>(3);

  navLinks = [
    { label: 'Overview', route: '/dashboard', icon: '📊' },
    { label: 'Marketplace Feed', route: '/items', icon: '🛍️' },
    { label: 'Trade Center', route: '/swaps', icon: '🔄' },
    { label: 'Direct Messages', route: '/chat', icon: '💬' },
    { label: 'My Closet Profile', route: '/profile', icon: '👔' },
    { label: 'Account Settings', route: '/profile/settings', icon: '⚙️' },
  ];

  weeklyActivityData = [
    { day: 'Mon', height: 45 },
    { day: 'Tue', height: 60 },
    { day: 'Wed', height: 80 },
    { day: 'Thu', height: 55 },
    { day: 'Fri', height: 95 },
    { day: 'Sat', height: 70 },
    { day: 'Sun', height: 85 },
  ];

  profileCompletion = computed(() => {
    const u = this.user();
    if (!u) return 75;
    let score = 50;
    if (u.avatarUrl) score += 25;
    if (u.bio) score += 25;
    return score;
  });

  activityFeed = signal([
    { id: 1, title: 'Received new 1:1 trade offer on Nike Sports Hoodie from Rohan G.', time: '10 minutes ago', icon: '📥' },
    { id: 2, title: 'Swap #849201 marked Shipped via BlueDart express', time: '2 hours ago', icon: '📦' },
    { id: 3, title: 'Earned 5-Star Karma Review from Ananya K. in Noida', time: '1 day ago', icon: '⭐' },
  ]);

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

    this.itemService.getItems({ limit: 3 }).subscribe({
      next: (res) => {
        if (res.data) this.suggestedSwaps.set(res.data);
      },
    });
  }
}
