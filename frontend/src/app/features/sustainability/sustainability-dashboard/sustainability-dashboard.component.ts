import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sustainability-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-12 max-w-7xl mx-auto">
      
      <!-- Sustainability Hero Header -->
      <div class="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-8 sm:p-12 border border-emerald-500/30 shadow-2xl text-white">
        <div class="relative z-10 space-y-6 max-w-3xl">
          <div class="flex items-center space-x-3">
            <span class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🌱 Circular Fashion Analytics
            </span>
            <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              Eco Score: 98/100 (Tier 1)
            </span>
          </div>
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            Empowering Zero-Waste Wardrobes Nationwide
          </h1>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            Fast fashion is the 2nd largest industrial polluter. Every garment swapped on ReWear keeps synthetic fibers out of landfills and reduces global textile manufacturing carbon footprints.
          </p>
        </div>

        <!-- Floating Background Glass Orb -->
        <div class="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </div>

      <!-- Real-Time Impact Counters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-2xl font-bold">
            ☁️
          </div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">14,250 kg</h3>
          <p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">CO₂ Emissions Prevented</p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-2xl font-bold">
            💧
          </div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">3,078,000 L</h3>
          <p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Freshwater Conserved</p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            ♻️
          </div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">4,890 kg</h3>
          <p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Textile Waste Diverted</p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🌲
          </div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">678 Trees</h3>
          <p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Equivalence Planted</p>
        </div>
      </div>

      <!-- Sustainability Achievement Badges -->
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Unlocked Sustainability Achievements</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          @for (badge of achievementBadges; track badge.name) {
            <div class="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div class="text-3xl">{{ badge.icon }}</div>
              <h4 class="text-xs font-extrabold text-slate-900 dark:text-white">{{ badge.name }}</h4>
              <p class="text-[10px] text-slate-400">{{ badge.desc }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Interactive Personal Closet Footprint Calculator -->
      <div class="glass-card p-8 sm:p-10 rounded-4xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-2xl">
        <div class="space-y-2 text-center max-w-2xl mx-auto">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Personal Eco-Impact Calculator</h2>
          <p class="text-xs sm:text-sm text-slate-400">See how much pollution you eliminate by swapping instead of buying brand new fast fashion.</p>
        </div>

        <div class="max-w-xl mx-auto space-y-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <span>Garments swapped per year:</span>
              <span class="text-emerald-500 text-lg font-black">{{ garmentsCount() }} items</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              [(ngModel)]="garmentsCount"
              class="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <!-- Live Dynamic Calculations Card -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <span class="block text-2xl font-black text-emerald-500">{{ calculatedCo2 }} kg</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">CO₂ Saved</span>
            </div>
            <div>
              <span class="block text-2xl font-black text-cyan-400">{{ calculatedWater }} L</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">Water Saved</span>
            </div>
            <div>
              <span class="block text-2xl font-black text-amber-400">{{ calculatedTrees }} Trees</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">Tree Equiv.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- City Swapper Eco Leaderboard -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">🏆 City Swapper Eco Leaderboard</h3>
          <span class="text-xs font-bold text-emerald-500">Live Ranking Updates</span>
        </div>

        <div class="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Swapper & Location</span>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Swaps & Impact</span>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            @for (swapper of cityLeaderboard; track swapper.rank) {
              <div class="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center space-x-4">
                  <span class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-900 dark:text-white">
                    #{{ swapper.rank }}
                  </span>
                  <img [src]="swapper.avatar" class="w-10 h-10 rounded-full object-cover border border-emerald-500/30" />
                  <div>
                    <h4 class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{{ swapper.name }}</span>
                      <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">{{ swapper.badge }}</span>
                    </h4>
                    <p class="text-[10px] text-slate-400">📍 {{ swapper.city }} • Verified Swapper</p>
                  </div>
                </div>

                <div class="text-right">
                  <span class="block text-sm font-black text-emerald-500">{{ swapper.swapsCount }} Swaps</span>
                  <span class="text-[10px] font-bold text-slate-400">{{ swapper.co2Saved }} kg CO₂ Saved</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Eco Tips Grid -->
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Sustainable Wardrobe Habits</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">Extend Garment Life</h4>
            <p class="text-xs text-slate-400 leading-relaxed">Extending the life of a garment by just 9 months reduces its carbon, waste, and water footprints by 20-30%.</p>
          </div>

          <div class="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">Zero Water Pollution</h4>
            <p class="text-xs text-slate-400 leading-relaxed">It takes 2,700 liters of water to make one new cotton shirt. Swapping eliminates manufacturing runoff entirely.</p>
          </div>

          <div class="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">Local Neighborhood Swapping</h4>
            <p class="text-xs text-slate-400 leading-relaxed">Hand-to-hand local swaps eliminate long-distance parcel transport emissions completely.</p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA Banner -->
      <div class="p-8 rounded-4xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white text-center space-y-4 shadow-xl">
        <h3 class="text-2xl sm:text-3xl font-black">Ready to Reduce Textile Waste Today?</h3>
        <p class="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">Explore thousands of pre-loved garments ready for 1:1 or 2:1 exchange in your area.</p>
        <div class="pt-2">
          <a routerLink="/items" class="inline-block px-8 py-3.5 rounded-full bg-white text-slate-900 font-black text-xs shadow-lg hover:scale-105 transition-all">
            Browse Eco Swaps Feed
          </a>
        </div>
      </div>

    </div>
  `,
})
export class SustainabilityDashboardComponent implements OnInit {
  garmentsCount = signal<number>(12);

  achievementBadges = [
    { icon: '🌱', name: 'Carbon Pioneer', desc: 'Saved 100+ kg CO2 emissions' },
    { icon: '👕', name: 'Textile Rescuer', desc: 'Rescued 15+ pre-loved garments' },
    { icon: '💧', name: 'Water Guardian', desc: 'Saved 30,000+ L freshwater' },
    { icon: '🌲', name: 'Forest Protector', desc: 'Planted 5+ tree equivalences' },
  ];

  cityLeaderboard = [
    { rank: 1, name: 'Ananya Sharma', city: 'Indiranagar, Bangalore', swapsCount: 42, co2Saved: 525, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', badge: '🛡️ Eco Icon' },
    { rank: 2, name: 'Rohan Mehta', city: 'Bandra, Mumbai', swapsCount: 38, co2Saved: 475, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', badge: '⚡ Fast Dispatch' },
    { rank: 3, name: 'Priya Verma', city: 'Connaught Place, Delhi', swapsCount: 29, co2Saved: 362, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', badge: '🌟 Top Trader' },
    { rank: 4, name: 'Karan Patel', city: 'Sector 18, Noida', swapsCount: 24, co2Saved: 300, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', badge: '🌱 Eco Champion' },
  ];

  get calculatedCo2(): number {
    return Math.round(this.garmentsCount() * 12.5);
  }

  get calculatedWater(): number {
    return Math.round(this.garmentsCount() * 2700);
  }

  get calculatedTrees(): number {
    return Math.round(this.calculatedCo2 / 21);
  }

  ngOnInit() {}
}
