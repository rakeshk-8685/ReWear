import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-sustainability-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ImageFallbackDirective],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 md:px-12 pb-24">
      <div class="max-w-6xl mx-auto space-y-12">
        
        <!-- Header -->
        <div class="space-y-1">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Community Hub
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            Connect with thousands of swappers committed to circular fashion and reducing textile waste.
          </p>
        </div>

        <!-- Section 1: Active Challenges -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Active Challenges
            </h2>

            <button class="text-xs font-bold text-[#2d5c2b] dark:text-emerald-400 hover:underline cursor-pointer">
              All challenges
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Green Featured Challenge Card -->
            <div class="bg-[#2d5c2b] dark:bg-[#1e3e1d] text-white rounded-[32px] p-6 sm:p-8 relative shadow-md overflow-hidden flex flex-col justify-between space-y-6">
              <div>
                <span class="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase inline-block mb-3">
                  LIMITED TIME
                </span>
                <h3 class="text-2xl font-extrabold mb-2 tracking-tight">
                  Swap, Don't Shop
                </h3>
                <p class="text-xs text-white/90 leading-relaxed max-w-sm font-medium">
                  Complete 3 swaps this month and earn the "Eco Champion" badge for your profile.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div class="flex items-center space-x-2">
                  <div class="flex -space-x-2 overflow-hidden">
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-[#2d5c2b] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" />
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-[#2d5c2b] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" />
                    <img class="inline-block h-7 w-7 rounded-full ring-2 ring-[#2d5c2b] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" />
                  </div>
                  <span class="text-xs font-bold text-white/90">1,280+ Participating</span>
                </div>

                <button class="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer">
                  Join Challenge
                </button>
              </div>
            </div>

            <!-- Light Ongoing Challenge Card -->
            <div class="bg-[#f4f3ed] dark:bg-slate-900 text-slate-900 dark:text-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <span class="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold tracking-wider uppercase inline-block mb-3">
                  ONGOING
                </span>
                <h3 class="text-2xl font-extrabold mb-2 tracking-tight">
                  Wardrobe Purge
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                  List 5 new items this week to help expand our sustainable community.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <span class="text-xs text-slate-400 font-serif italic">
                  "Gave 5 pieces a new home!" — @alex_w
                </span>

                <button class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Section 2: Swaps Near You -->
        <div class="space-y-4 pt-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Swaps Near You
              </h2>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                Discover items available for local meetup in East London.
              </p>
            </div>

            <div class="flex items-center space-x-3">
              <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full p-1 text-xs font-bold flex items-center space-x-1 shadow-sm">
                <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">List View</span>
                <span class="px-3 py-1 text-slate-400 cursor-pointer">Map View</span>
              </div>

              <select class="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Within 25 km</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div [routerLink]="['/items', 'demo-near-1']" class="group cursor-pointer block">
              <div class="aspect-[4/4.8] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800 p-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-all shadow-inner mb-3">
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm">
                  0.8 KM AWAY
                </span>

                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800"
                  appImageFallback
                  class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div class="space-y-0.5">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  Classic Trench Coat
                </h4>
                <p class="text-xs text-slate-500 font-medium">
                  Burberry · Size L · £180 Est.
                </p>
                <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 inline-block mt-1">
                  MEET LOCALLY
                </span>
              </div>
            </div>

            <div [routerLink]="['/items', 'demo-near-2']" class="group cursor-pointer block">
              <div class="aspect-[4/4.8] rounded-3xl bg-[#f4f2ea] dark:bg-slate-800 p-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-all shadow-inner mb-3">
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm">
                  1.2 KM AWAY
                </span>

                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"
                  appImageFallback
                  class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div class="space-y-0.5">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  Wool Knit Sweater
                </h4>
                <p class="text-xs text-slate-500 font-medium">
                  COS · Size L · £42 Est.
                </p>
                <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 inline-block mt-1">
                  MEET LOCALLY
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- Section 3: Bottom Split Grid (Top Swappers & Sustainable Fashion Tips) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          
          <!-- Left Column: Top Swappers -->
          <div class="lg:col-span-4 space-y-4">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Swappers
            </h3>

            <div class="space-y-3">
              <div class="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                    1
                  </span>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" appImageFallback class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">Sarah W.</h4>
                    <span class="text-[10px] text-slate-400 font-bold uppercase">128 SWAPS</span>
                  </div>
                </div>
                <span class="text-slate-400 text-xs font-bold">›</span>
              </div>

              <div class="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                    2
                  </span>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" appImageFallback class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">James L.</h4>
                    <span class="text-[10px] text-slate-400 font-bold uppercase">94 SWAPS</span>
                  </div>
                </div>
                <span class="text-slate-400 text-xs font-bold">›</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Sustainable Fashion Tips -->
          <div class="lg:col-span-8 space-y-4">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sustainable Fashion Tips
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group cursor-pointer">
                <div class="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600" appImageFallback class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="p-5 space-y-1.5">
                  <span class="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    CARE GUIDE
                  </span>
                  <h4 class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                    How to make your knits last a lifetime
                  </h4>
                  <p class="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    Proper washing and storage can double the life of your wool and cashmere pieces.
                  </p>
                </div>
              </div>

              <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group cursor-pointer">
                <div class="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600" appImageFallback class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="p-5 space-y-1.5">
                  <span class="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    TREND REPORT
                  </span>
                  <h4 class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                    The circular future of luxury fashion
                  </h4>
                  <p class="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    Why top designers are moving towards upcycling and swap-friendly models.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  `,
})
export class SustainabilityDashboardComponent implements OnInit {
  ngOnInit() {}
}
