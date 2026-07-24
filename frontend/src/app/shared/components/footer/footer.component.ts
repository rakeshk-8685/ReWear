import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Impact KPI Highlight Banner -->
        <div class="mb-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-900/50 via-teal-900/30 to-slate-900 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7.865M16 19h1.5a2.5 2.5 0 002.5-2.5V14.5a2.5 2.5 0 00-2.5-2.5H16" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">Environmental Impact Counter</h4>
              <p class="text-sm text-slate-300">Together, our community has saved over <span class="text-emerald-400 font-bold">14,250 kg of CO2</span> and thousands of garments from landfills.</p>
            </div>
          </div>
          <a routerLink="/sustainability" class="px-6 py-3 rounded-full btn-primary text-sm whitespace-nowrap">
            Explore Sustainability Analytics
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <!-- Column 1: Brand -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                R
              </div>
              <span class="text-lg font-bold text-white">ReWear</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              The premier peer-to-peer sustainable clothing exchange. Swap your closet, reduce fast fashion waste, and refresh your style effortlessly.
            </p>
          </div>

          <!-- Column 2: Marketplace -->
          <div>
            <h5 class="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Marketplace</h5>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/items" [queryParams]="{category: 'Vintage'}" class="hover:text-emerald-400 transition-colors">Vintage Apparel</a></li>
              <li><a routerLink="/items" [queryParams]="{category: 'Outerwear'}" class="hover:text-emerald-400 transition-colors">Jackets & Outerwear</a></li>
              <li><a routerLink="/items" [queryParams]="{category: 'Dresses'}" class="hover:text-emerald-400 transition-colors">Dresses & Suits</a></li>
              <li><a routerLink="/items" [queryParams]="{category: 'Shoes'}" class="hover:text-emerald-400 transition-colors">Sneakers & Boots</a></li>
            </ul>
          </div>

          <!-- Column 3: How it Works -->
          <div>
            <h5 class="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">How it Works</h5>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/items" class="hover:text-emerald-400 transition-colors">List Your Pre-Loved Clothing</a></li>
              <li><a routerLink="/swaps" class="hover:text-emerald-400 transition-colors">Propose 1:1 or 2:1 Swaps</a></li>
              <li><a routerLink="/chat" class="hover:text-emerald-400 transition-colors">Chat & Ship Safely</a></li>
              <li><a routerLink="/sustainability" class="hover:text-emerald-400 transition-colors">Earn Swap Karma Ratings</a></li>
            </ul>
          </div>

          <!-- Column 4: Trust & Security -->
          <div>
            <h5 class="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Trust & Safety</h5>
            <ul class="space-y-2.5 text-sm">
              <li><span class="text-emerald-400 font-semibold">✓</span> Verified Swap Member Badges</li>
              <li><span class="text-emerald-400 font-semibold">✓</span> Real-Time Tracking Integration</li>
              <li><span class="text-emerald-400 font-semibold">✓</span> Dispute Resolution System</li>
              <li><span class="text-emerald-400 font-semibold">✓</span> 100% Free Clothing Exchange</li>
            </ul>
          </div>

        </div>

        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 ReWear Marketplace. Built with MEAN Stack & Angular 20 Standalone Architecture.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a routerLink="/sustainability" class="hover:text-slate-400">Sustainability Guidelines</a>
            <a routerLink="/" class="hover:text-slate-400">Privacy Policy</a>
            <a routerLink="/" class="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {}
