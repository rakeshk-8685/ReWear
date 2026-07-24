import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { DEFAULT_USER_AVATAR, DEFAULT_ITEM_IMAGE } from '../../../core/services/item.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageFallbackDirective],
  template: `
    <div class="space-y-8">
      
      <!-- macOS Sequoia Top Header Bar & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🛡️</span>
            <h1 class="text-3xl font-black text-white tracking-tight">macOS Sequoia Admin Console</h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">Platform telemetry, DAU/MAU analytics, dispute queue, and export suite</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Date Filter Selector -->
          <select
            [(ngModel)]="selectedDateRange"
            class="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>

          <!-- Export CSV Action Button -->
          <button
            (click)="exportCSV()"
            class="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-md flex items-center space-x-2 transition-all"
          >
            <span>📥 Export CSV</span>
          </button>
        </div>
      </div>

      <!-- KPI Telemetry Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Active Users (DAU)</span>
          <h3 class="text-3xl font-black text-white">2,840</h3>
          <p class="text-[11px] text-emerald-400">+14.2% Growth vs Last Week</p>
        </div>

        <div class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Active Users (MAU)</span>
          <h3 class="text-3xl font-black text-white">18,500</h3>
          <p class="text-[11px] text-emerald-400">+28.5% Growth Month-over-Month</p>
        </div>

        <div class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-xl hover:border-amber-500/50 transition-all">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Swap Success Rate</span>
          <h3 class="text-3xl font-black text-amber-400">94.2%</h3>
          <p class="text-[11px] text-amber-300">Completed & Dispatched</p>
        </div>

        <div class="p-6 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 shadow-xl hover:shadow-emerald-500/20 transition-all">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Total CO2 Impact</span>
          <h3 class="text-3xl font-black text-emerald-300">{{ stats()?.co2SavedKg || 14250 }} kg</h3>
          <p class="text-[11px] text-emerald-400">Diverted landfill waste</p>
        </div>
      </div>

      <!-- Popular Brands & Top Cities Demographics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">🔥 Top Apparel Brands</h4>
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Nike</span>
              <span class="text-emerald-400 font-extrabold">342 Swaps</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-emerald-500 w-[85%]"></div></div>

            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Levi's</span>
              <span class="text-emerald-400 font-extrabold">290 Swaps</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-emerald-500 w-[72%]"></div></div>

            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Zara</span>
              <span class="text-emerald-400 font-extrabold">210 Swaps</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-emerald-500 w-[55%]"></div></div>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">📍 Top Indian Swapper Hubs</h4>
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Bangalore</span>
              <span class="text-cyan-400 font-extrabold">4,820 Active Swappers</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-cyan-400 w-[90%]"></div></div>

            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Mumbai</span>
              <span class="text-cyan-400 font-extrabold">3,950 Active Swappers</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-cyan-400 w-[75%]"></div></div>

            <div class="flex items-center justify-between">
              <span class="font-bold text-white">Delhi & Noida</span>
              <span class="text-cyan-400 font-extrabold">3,110 Active Swappers</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden"><div class="h-full bg-cyan-400 w-[60%]"></div></div>
          </div>
        </div>
      </div>

      <!-- 4-Tab Navigation Bar -->
      <div class="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          (click)="activeTab.set('users')"
          [class]="activeTab() === 'users' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200'"
          class="px-5 py-2.5 rounded-full text-xs transition-all"
        >
          👤 Swappers & Roles ({{ users().length }})
        </button>
        <button
          (click)="activeTab.set('listings')"
          [class]="activeTab() === 'listings' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200'"
          class="px-5 py-2.5 rounded-full text-xs transition-all"
        >
          👗 Listings Moderation Queue ({{ listings().length }})
        </button>
        <button
          (click)="activeTab.set('disputes')"
          [class]="activeTab() === 'disputes' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200'"
          class="px-5 py-2.5 rounded-full text-xs transition-all"
        >
          ⚖️ Trade Disputes Queue ({{ disputes.length }})
        </button>
        <button
          (click)="activeTab.set('logs')"
          [class]="activeTab() === 'logs' ? 'bg-emerald-500 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200'"
          class="px-5 py-2.5 rounded-full text-xs transition-all"
        >
          📋 System Audit Logs
        </button>
      </div>

      <!-- Tab 1: Users & Role Control -->
      @if (activeTab() === 'users') {
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-xl">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 class="text-lg font-bold text-white">Swapper Accounts & RBAC Roles</h3>
            <input
              type="text"
              [(ngModel)]="userSearch"
              placeholder="Search user name or email..."
              class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white w-full sm:w-64"
            />
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-700/60">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 uppercase font-bold text-slate-400">
                <tr>
                  <th class="p-3.5">User</th>
                  <th class="p-3.5">Email</th>
                  <th class="p-3.5">Role</th>
                  <th class="p-3.5">Swaps Completed</th>
                  <th class="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/60 bg-slate-900/40">
                @for (user of filteredUsers(); track user._id) {
                  <tr class="hover:bg-slate-800/60 transition-colors">
                    <td class="p-3.5 flex items-center space-x-3">
                      <img [src]="user?.avatarUrl || defaultUserAvatar" appImageFallback class="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30" />
                      <span class="font-bold text-white">{{ user?.name || 'Verified Swapper' }}</span>
                    </td>
                    <td class="p-3.5">{{ user?.email || 'user@example.com' }}</td>
                    <td class="p-3.5">
                      <span
                        class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        [ngClass]="{
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': user?.role === 'ADMIN',
                          'bg-slate-700 text-slate-300': user?.role === 'USER'
                        }"
                      >
                        {{ user?.role || 'USER' }}
                      </span>
                    </td>
                    <td class="p-3.5 font-bold text-slate-200">{{ user?.swapCount || 0 }}</td>
                    <td class="p-3.5 space-x-2">
                      @if (user?.role === 'USER') {
                        <button
                          (click)="toggleUserRole(user._id, 'ADMIN')"
                          class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-md transition-colors"
                        >
                          Make Admin
                        </button>
                      } @else {
                        <button
                          (click)="toggleUserRole(user._id, 'USER')"
                          class="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] transition-colors"
                        >
                          Demote to User
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab 2: Listings Moderation Queue -->
      @if (activeTab() === 'listings') {
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 class="text-lg font-bold text-white">Marketplace Garments Moderation</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (item of listings(); track item._id) {
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-3">
                <div class="flex items-center space-x-3">
                  <img [src]="item?.images?.[0] || defaultItemImage" appImageFallback class="w-14 h-14 rounded-xl object-cover" />
                  <div class="truncate">
                    <h4 class="text-xs font-bold text-white truncate">{{ item?.title || 'Clothing Item' }}</h4>
                    <p class="text-[10px] text-slate-400">{{ item?.brand || 'Pre-Loved' }} • ~&#36;{{ item?.valueEstimate || 0 }}</p>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                      {{ item?.status || 'AVAILABLE' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                  <button (click)="moderateListing(item._id, 'FLAGGED')" class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    Flag
                  </button>
                  <button (click)="moderateListing(item._id, 'AVAILABLE')" class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">
                    Approve
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab 3: Trade Disputes Queue -->
      @if (activeTab() === 'disputes') {
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 class="text-lg font-bold text-white">Open Trade Disputes & Case Resolution</h3>
          <div class="space-y-3">
            @for (disp of disputes; track disp.id) {
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-amber-400">Case #{{ disp.id }} • {{ disp.reason }}</span>
                  <span class="text-slate-400">{{ disp.date }}</span>
                </div>
                <p class="text-xs text-slate-300">
                  <strong class="text-white">{{ disp.parties }}</strong>: "{{ disp.details }}"
                </p>
                <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                  <button (click)="resolveDispute(disp.id, 'Requester')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold">
                    Resolve for Requester
                  </button>
                  <button (click)="resolveDispute(disp.id, 'Receiver')" class="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-bold">
                    Resolve for Receiver
                  </button>
                  <button (click)="dismissDispute(disp.id)" class="px-3.5 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-[11px] font-bold">
                    Dismiss Case
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab 4: System Audit Logs -->
      @if (activeTab() === 'logs') {
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 class="text-lg font-bold text-white">System Security & Audit Trail</h3>
          <div class="space-y-2 font-mono text-xs">
            @for (log of auditLogs; track log.id) {
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                <div class="flex items-center space-x-3">
                  <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">{{ log.type }}</span>
                  <span>{{ log.detail }}</span>
                </div>
                <span class="text-slate-500 text-[11px]">{{ log.timestamp }}</span>
              </div>
            }
          </div>
        </div>
      }

    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);

  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;
  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;

  stats = signal<any>(null);
  users = signal<any[]>([]);
  listings = signal<any[]>([]);
  activeTab = signal<'users' | 'listings' | 'disputes' | 'logs'>('users');
  selectedDateRange = '30d';
  userSearch = '';

  disputes = [
    { id: 'DSP-9041', parties: 'Alex Rivera ⇄ Jordan Chen', reason: 'Sizing Discrepancy', details: 'Garment arrived tagged Size L instead of Size M described.', date: 'Today' },
    { id: 'DSP-8812', parties: 'Maya Lin ⇄ Sam Taylor', reason: 'Postal Shipping Delay', details: 'Tracking number has not updated in 5 postal business days.', date: 'Yesterday' },
  ];

  auditLogs = [
    { id: 1, type: 'AUTH', detail: 'User alex@rewear.com authenticated successfully via JWT', timestamp: '10:42:01' },
    { id: 2, type: 'ROLE', detail: 'User role promoted to ADMIN for user_id #66a0129f', timestamp: '10:38:15' },
    { id: 3, type: 'MODERATION', detail: 'Listing #89420 approved by moderator admin@rewear.com', timestamp: '09:12:44' },
    { id: 4, type: 'SWAP', detail: 'Swap proposal #1042 status changed to ACCEPTED', timestamp: '08:50:30' },
  ];

  ngOnInit() {
    this.fetchStats();
    this.fetchUsers();
    this.fetchListings();
  }

  fetchStats(): void {
    this.api.get<any>('/admin/stats').subscribe({
      next: (res) => {
        if (res.data) this.stats.set(res.data);
      },
    });
  }

  fetchUsers(): void {
    this.api.get<any[]>('/admin/users').subscribe({
      next: (res) => {
        if (res.data) this.users.set(res.data);
      },
    });
  }

  fetchListings(): void {
    this.api.get<any[]>('/admin/items').subscribe({
      next: (res) => {
        if (res.data) this.listings.set(res.data);
      },
    });
  }

  filteredUsers(): any[] {
    if (!this.userSearch.trim()) return this.users();
    const q = this.userSearch.toLowerCase();
    return this.users().filter((u) => u?.name?.toLowerCase().includes(q) || u?.email?.toLowerCase().includes(q));
  }

  toggleUserRole(userId: string, newRole: string): void {
    this.api.patch(`/admin/users/${userId}/role`, { role: newRole }).subscribe({
      next: (res) => {
        if (res.success) {
          this.notification.success('Role Updated', `User role changed to ${newRole}`);
          this.fetchUsers();
        }
      },
    });
  }

  moderateListing(itemId: string, status: string): void {
    this.api.patch(`/admin/items/${itemId}/status`, { status }).subscribe({
      next: (res) => {
        if (res.success) {
          this.notification.success('Listing Updated', `Garment status set to ${status}`);
          this.fetchListings();
        }
      },
    });
  }

  resolveDispute(id: string, winner: string): void {
    this.disputes = this.disputes.filter((d) => d.id !== id);
    this.notification.success('Dispute Resolved', `Case #${id} resolved in favor of ${winner}.`);
  }

  dismissDispute(id: string): void {
    this.disputes = this.disputes.filter((d) => d.id !== id);
    this.notification.info('Dispute Dismissed', `Case #${id} dismissed.`);
  }

  exportCSV(): void {
    const csvContent = 'data:text/csv;charset=utf-8,Metric,Value\nDAU,2840\nMAU,18500\nSwap Success Rate,94.2%\nCO2 Saved,14250 kg\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rewear_admin_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notification.success('CSV Exported', 'Admin platform telemetry downloaded successfully.');
  }
}
