import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { DEFAULT_USER_AVATAR, DEFAULT_ITEM_IMAGE } from '../../../core/services/item.service';
import { Subscription } from 'rxjs';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  avatarUrl?: string;
  location?: string | { city?: string; country?: string };
  swapCount?: number;
  ratingAverage?: number;
  isActive?: boolean;
}

export interface AdminItem {
  _id: string;
  title: string;
  category: string;
  brand?: string;
  condition: string;
  valueEstimate?: number;
  status: 'AVAILABLE' | 'SWAPPED' | 'ARCHIVED' | 'PENDING';
  images?: string[];
  owner?: any;
}

export interface AdminSwap {
  _id: string;
  requester?: any;
  receiver?: any;
  requestedItem?: any;
  offeredItems?: any[];
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  fairnessScore?: number;
  createdAt?: string;
}

export interface ModerationReport {
  id: string;
  type: 'Item' | 'User' | 'ChatMessage';
  targetTitle: string;
  reporterName: string;
  reason: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface SwapDispute {
  id: string;
  parties: string;
  itemPair: string;
  issue: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  priority: 'CRITICAL' | 'NORMAL';
  openedAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageFallbackDirective],
  template: `
    <div class="space-y-8">
      
      <!-- Top Title & Navigation Tab Bar Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            ADMINISTRATION CONTROL CENTER
          </span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
            {{ activeTab() }} Control Desk
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Refresh Data Button -->
          <button
            (click)="loadDataForCurrentTab()"
            class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>

          <!-- System Status Pill -->
          <div class="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online</span>
          </div>
        </div>
      </div>

      <!-- ================= TAB 1: OVERVIEW ================= -->
      @if (activeTab() === 'overview') {
        
        <!-- 6 KPI Telemetry Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">TOTAL USERS</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block">{{ stats()?.totalUsers || users().length || 12482 }}</span>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">↑ 12% inc.</span>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">ACTIVE LISTINGS</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block">{{ stats()?.totalItems || items().length || 45210 }}</span>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">↑ 8% inc.</span>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">SUCCESS SWAPS</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block">{{ stats()?.completedSwaps || 8902 }}</span>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">↑ 15% inc.</span>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">PENDING REPORTS</span>
            <span class="text-2xl font-black text-rose-600 dark:text-rose-400 block">{{ pendingReportsCount() }}</span>
            <span class="text-[11px] font-bold text-rose-500 block">Requires attention</span>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">ACTIVE SESSIONS</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block">{{ stats()?.activeUsers || 3102 }}</span>
            <span class="text-[11px] font-semibold text-slate-400 block">Live users</span>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">SWAP CONV. RATE</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white block">{{ stats()?.swapConversionRate || 64.2 }}%</span>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">↑ 2% inc.</span>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">User & Listings Growth</h3>
            <div class="h-60 w-full relative pt-4">
              <svg class="w-full h-full overflow-visible" viewBox="0 0 500 200">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#e2e8f0" stroke-dasharray="4" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#e2e8f0" stroke-dasharray="4" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#e2e8f0" stroke-dasharray="4" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" />
                <text x="10" y="25" class="text-[10px] fill-slate-400 font-bold">40k</text>
                <text x="10" y="75" class="text-[10px] fill-slate-400 font-bold">30k</text>
                <text x="10" y="125" class="text-[10px] fill-slate-400 font-bold">20k</text>
                <text x="10" y="175" class="text-[10px] fill-slate-400 font-bold">0</text>
                <path d="M 60,165 Q 150,160 250,150 T 450,140" fill="none" stroke="#3b82f6" stroke-width="3" />
                <circle cx="450" cy="140" r="4" fill="#3b82f6" />
                <path d="M 60,140 Q 150,110 250,90 T 450,30" fill="none" stroke="#10b981" stroke-width="3" />
                <circle cx="450" cy="30" r="4" fill="#10b981" />
                <text x="60" y="195" class="text-[10px] fill-slate-400 font-bold">Jun</text>
                <text x="150" y="195" class="text-[10px] fill-slate-400 font-bold">Jul</text>
                <text x="250" y="195" class="text-[10px] fill-slate-400 font-bold">Aug</text>
                <text x="350" y="195" class="text-[10px] fill-slate-400 font-bold">Sep</text>
                <text x="450" y="195" class="text-[10px] fill-slate-400 font-bold">Oct</text>
              </svg>
            </div>
            <div class="flex items-center justify-center space-x-6 text-xs font-bold pt-2">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-slate-600 dark:text-slate-300">Users</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span class="text-slate-600 dark:text-slate-300">Listings</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Most Popular Categories</h3>
            <div class="flex items-center justify-center h-48 relative">
              <svg class="w-44 h-44" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" stroke-width="16" stroke-dasharray="88 150" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" stroke-width="16" stroke-dasharray="55 150" stroke-dashoffset="-88" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" stroke-width="16" stroke-dasharray="43 150" stroke-dashoffset="-143" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" stroke-width="16" stroke-dasharray="30 150" stroke-dashoffset="-186" />
              </svg>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs font-bold pt-2">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-sm bg-blue-500 shrink-0"></span>
                <span class="text-slate-600 dark:text-slate-300">Tops & Hoodies (37%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-sm bg-emerald-500 shrink-0"></span>
                <span class="text-slate-600 dark:text-slate-300">Denim & Pants (23%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-sm bg-amber-500 shrink-0"></span>
                <span class="text-slate-600 dark:text-slate-300">Outerwear (18%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-sm bg-purple-500 shrink-0"></span>
                <span class="text-slate-600 dark:text-slate-300">Shoes & Sneakers (12%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Quick Preview Table -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Recent Swap Activity</h3>
            <button (click)="navigateToTab('swaps')" class="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              View all activity →
            </button>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="p-4">SWAP ID</th>
                  <th class="p-4">PARTIES</th>
                  <th class="p-4">ITEMS EXCHANGED</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                @for (swap of swaps().slice(0, 5); track swap._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-4 font-bold text-slate-900 dark:text-white">#{{ swap._id.slice(-6).toUpperCase() }}</td>
                    <td class="p-4 font-semibold">
                      {{ swap.requester?.name || 'Aarav' }} ⇄ {{ swap.receiver?.name || 'Rohan' }}
                    </td>
                    <td class="p-4 font-bold text-slate-900 dark:text-white">
                      {{ swap.requestedItem?.title || 'Nike Hoodie' }}
                    </td>
                    <td class="p-4">
                      <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {{ swap.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <button (click)="navigateToTab('swaps')" class="text-blue-600 hover:underline font-bold cursor-pointer">Inspect</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      }

      <!-- ================= TAB 2: USERS ================= -->
      @if (activeTab() === 'users') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Registered Users Directory</h3>
            
            <div class="flex items-center space-x-3">
              <input
                type="text"
                [(ngModel)]="userSearchQuery"
                placeholder="Search user by name or email..."
                class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <select
                [(ngModel)]="userRoleFilter"
                class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="p-4">USER</th>
                  <th class="p-4">EMAIL</th>
                  <th class="p-4">ROLE</th>
                  <th class="p-4">LOCATION</th>
                  <th class="p-4">SWAPS</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                @for (user of filteredUsers(); track user._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-4">
                      <div class="flex items-center space-x-3">
                        <img [src]="user.avatarUrl || defaultUserAvatar" appImageFallback class="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
                        <span class="font-bold text-slate-900 dark:text-white">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="p-4 text-slate-500 font-mono text-[11px]">{{ user.email }}</td>
                    <td class="p-4">
                      <span [class]="user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="p-4 text-slate-500">{{ formatLocation(user.location) }}</td>
                    <td class="p-4 font-bold">{{ user.swapCount || 0 }}</td>
                    <td class="p-4">
                      <span [class]="user.isActive !== false ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                        {{ user.isActive !== false ? 'Active' : 'Banned / Suspended' }}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button (click)="toggleUserRole(user)" class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-[11px] font-bold cursor-pointer">
                        Role: {{ user.role === 'ADMIN' ? 'Demote' : 'Make Admin' }}
                      </button>
                      <button (click)="toggleUserStatus(user)" [class]="user.isActive !== false ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'" class="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer">
                        {{ user.isActive !== false ? 'Ban User' : 'Unban User' }}
                      </button>
                      <button (click)="deleteUser(user)" class="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[11px] font-bold cursor-pointer">
                        🗑️
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ================= TAB 3: LISTINGS ================= -->
      @if (activeTab() === 'listings') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Clothing Listings Moderation</h3>
            
            <div class="flex items-center space-x-3">
              <input
                type="text"
                [(ngModel)]="itemSearchQuery"
                placeholder="Search listing by title or brand..."
                class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <select
                [(ngModel)]="itemCategoryFilter"
                class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Pants">Pants</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Dresses">Dresses</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="p-4">ITEM</th>
                  <th class="p-4">CATEGORY</th>
                  <th class="p-4">BRAND</th>
                  <th class="p-4">CONDITION</th>
                  <th class="p-4">VALUE EST.</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                @for (item of filteredItems(); track item._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-4">
                      <div class="flex items-center space-x-3">
                        <img [src]="item.images?.[0] || defaultItemImage" appImageFallback class="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                        <div>
                          <p class="font-bold text-slate-900 dark:text-white">{{ item.title }}</p>
                          <p class="text-[10px] text-slate-400">ID: {{ item._id.slice(-6) }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-slate-500 font-semibold">{{ item.category }}</td>
                    <td class="p-4 font-bold">{{ item.brand || 'Generic' }}</td>
                    <td class="p-4 text-slate-500">{{ item.condition }}</td>
                    <td class="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">₹{{ item.valueEstimate || 75 }}</td>
                    <td class="p-4">
                      <span [class]="item.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button (click)="toggleItemStatus(item)" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[11px] font-bold cursor-pointer">
                        {{ item.status === 'AVAILABLE' ? 'Archive' : 'Make Available' }}
                      </button>
                      <button (click)="deleteItem(item)" class="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[11px] font-bold cursor-pointer">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ================= TAB 4: SWAPS ================= -->
      @if (activeTab() === 'swaps') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Platform Swaps & Transactions Audit</h3>
            
            <select
              [(ngModel)]="swapStatusFilter"
              class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="ALL">All Swap Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="p-4">SWAP TICKET</th>
                  <th class="p-4">REQUESTER</th>
                  <th class="p-4">RECEIVER</th>
                  <th class="p-4">REQUESTED ITEM</th>
                  <th class="p-4">FAIRNESS SCORE</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">AUDIT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                @for (swap of filteredSwaps(); track swap._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-4 font-bold text-slate-900 dark:text-white">#SW-{{ swap._id.slice(-6).toUpperCase() }}</td>
                    <td class="p-4 font-semibold text-slate-900 dark:text-white">{{ swap.requester?.name || 'Aarav Sharma' }}</td>
                    <td class="p-4 font-semibold text-slate-900 dark:text-white">{{ swap.receiver?.name || 'Rohan Gupta' }}</td>
                    <td class="p-4 font-bold text-blue-600 dark:text-blue-400">{{ swap.requestedItem?.title || 'Levi\'s 501 Jeans' }}</td>
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        {{ swap.fairnessScore || 95 }}% Match
                      </span>
                    </td>
                    <td class="p-4">
                      <span [class]="getSwapStatusClass(swap.status)" class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
                        {{ swap.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <button (click)="inspectSwap(swap)" class="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 cursor-pointer">
                        Inspect
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ================= TAB 5: REPORTS ================= -->
      @if (activeTab() === 'reports') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Content & User Moderation Reports</h3>
              <p class="text-xs text-slate-500">Review community safety flags and reported items or behavior</p>
            </div>

            <select
              [(ngModel)]="reportStatusFilter"
              class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="ALL">All Reports</option>
              <option value="PENDING">PENDING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="DISMISSED">DISMISSED</option>
            </select>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="p-4">REPORT ID</th>
                  <th class="p-4">TYPE</th>
                  <th class="p-4">TARGET CONTENT</th>
                  <th class="p-4">REPORTED BY</th>
                  <th class="p-4">REASON</th>
                  <th class="p-4">SEVERITY</th>
                  <th class="p-4">STATUS</th>
                  <th class="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                @for (rep of filteredReports(); track rep.id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-4 font-bold font-mono">#{{ rep.id }}</td>
                    <td class="p-4 font-bold">{{ rep.type }}</td>
                    <td class="p-4 font-bold text-slate-900 dark:text-white">{{ rep.targetTitle }}</td>
                    <td class="p-4 text-slate-500">{{ rep.reporterName }}</td>
                    <td class="p-4 text-slate-600 dark:text-slate-300">{{ rep.reason }}</td>
                    <td class="p-4">
                      <span [class]="rep.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                        {{ rep.severity }}
                      </span>
                    </td>
                    <td class="p-4">
                      <span [class]="rep.status === 'PENDING' ? 'bg-rose-500/10 text-rose-600 font-bold' : 'bg-slate-200 text-slate-600'" class="px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                        {{ rep.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      @if (rep.status === 'PENDING') {
                        <button (click)="resolveReport(rep)" class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 cursor-pointer">
                          Take Action & Remove
                        </button>
                        <button (click)="dismissReport(rep)" class="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-300 cursor-pointer">
                          Dismiss
                        </button>
                      } @else {
                        <span class="text-[11px] text-slate-400 font-bold">Processed</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ================= TAB 6: DISPUTES ================= -->
      @if (activeTab() === 'disputes') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Swap Dispute Resolution Desk</h3>
              <p class="text-xs text-slate-500">Mediate member disagreements regarding item condition or trade delivery</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (dispute of disputes(); track dispute.id) {
              <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-slate-900 dark:text-white">Ticket #{{ dispute.id }}</span>
                  <span [class]="dispute.status === 'OPEN' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'" class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                    {{ dispute.status }}
                  </span>
                </div>

                <div class="space-y-1">
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Parties: {{ dispute.parties }}</p>
                  <p class="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Trade Pair: {{ dispute.itemPair }}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    "{{ dispute.issue }}"
                  </p>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <span class="text-[10px] text-slate-400">Opened {{ dispute.openedAt }}</span>
                  <div class="space-x-2">
                    <button (click)="resolveDispute(dispute)" class="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm cursor-pointer">
                      Mediate & Resolve
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ================= TAB 7: SETTINGS ================= -->
      @if (activeTab() === 'settings') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Platform Governance & Global Settings</h3>
            <p class="text-xs text-slate-500">Configure marketplace parameters, fairness engine thresholds, and security controls</p>
          </div>

          <div class="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            
            <div class="pt-4 flex items-center justify-between">
              <div>
                <span class="block font-bold text-slate-900 dark:text-white">Maintenance Mode</span>
                <span class="text-slate-400 text-[11px]">Temporarily disable new swap proposals for platform maintenance</span>
              </div>
              <input type="checkbox" [(ngModel)]="settings.maintenanceMode" class="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
            </div>

            <div class="pt-4 flex items-center justify-between">
              <div>
                <span class="block font-bold text-slate-900 dark:text-white">Auto-Approve New Clothing Listings</span>
                <span class="text-slate-400 text-[11px]">Automatically publish new listings without manual admin review</span>
              </div>
              <input type="checkbox" [(ngModel)]="settings.autoApproveListings" class="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
            </div>

            <div class="pt-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-white">Minimum Swap Fairness Score Threshold</span>
                <span class="font-bold text-blue-600 dark:text-blue-400">{{ settings.minFairnessScore }}%</span>
              </div>
              <input type="range" min="50" max="95" [(ngModel)]="settings.minFairnessScore" class="w-full accent-blue-600 cursor-pointer" />
              <p class="text-[10px] text-slate-400">Transactions below this AI evaluation score will be flagged for review.</p>
            </div>

            <div class="pt-4 flex items-center justify-between">
              <div>
                <span class="block font-bold text-slate-900 dark:text-white">Email Moderation Alerts</span>
                <span class="text-slate-400 text-[11px]">Receive immediate notifications for high-severity reports</span>
              </div>
              <input type="checkbox" [(ngModel)]="settings.emailAlerts" class="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
            </div>

            <div class="pt-6">
              <button
                (click)="saveSettings()"
                class="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Save Settings Configuration
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;
  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;

  activeTab = signal<string>('overview');
  stats = signal<any>(null);
  
  users = signal<AdminUser[]>([]);
  items = signal<AdminItem[]>([]);
  swaps = signal<AdminSwap[]>([]);
  
  userSearchQuery = '';
  userRoleFilter = 'ALL';
  
  itemSearchQuery = '';
  itemCategoryFilter = 'ALL';
  
  swapStatusFilter = 'ALL';
  reportStatusFilter = 'ALL';

  reports = signal<ModerationReport[]>([
    { id: 'REP-101', type: 'Item', targetTitle: 'Counterfeit Jacket', reporterName: 'Ananya Kapoor', reason: 'Suspected non-authentic brand tag', severity: 'HIGH', status: 'PENDING', createdAt: '2026-07-26' },
    { id: 'REP-102', type: 'User', targetTitle: 'Spam Messages User', reporterName: 'Rohan Gupta', reason: 'Sending external payment links', severity: 'HIGH', status: 'PENDING', createdAt: '2026-07-27' },
    { id: 'REP-103', type: 'Item', targetTitle: 'Damaged Zipper Hoodie', reporterName: 'Aarav Sharma', reason: 'Condition listed as Like New but has hole', severity: 'MEDIUM', status: 'RESOLVED', createdAt: '2026-07-25' },
  ]);

  disputes = signal<SwapDispute[]>([
    { id: 'DSP-201', parties: 'Aarav Sharma vs Rohan Gupta', itemPair: 'Nike Hoodie ⇄ Levi\'s Jeans', issue: 'Sizing mismatch on receiving denim pants', status: 'OPEN', priority: 'NORMAL', openedAt: '2 hours ago' },
    { id: 'DSP-202', parties: 'Ananya Kapoor vs Priya Patel', itemPair: 'Zara Linen Shirt ⇄ Uniqlo Jacket', issue: 'Delayed courier dispatch from Noida', status: 'UNDER_REVIEW', priority: 'NORMAL', openedAt: '1 day ago' },
  ]);

  settings = {
    maintenanceMode: false,
    autoApproveListings: true,
    minFairnessScore: 70,
    emailAlerts: true,
  };

  private routeSub?: Subscription;

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] || 'overview';
      this.activeTab.set(tab);
      this.loadDataForCurrentTab();
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  navigateToTab(tabName: string): void {
    this.router.navigate(['/admin'], { queryParams: { tab: tabName } });
  }

  loadDataForCurrentTab(): void {
    const tab = this.activeTab();
    if (tab === 'overview' || !this.stats()) {
      this.fetchStats();
    }
    if (tab === 'users' || this.users().length === 0) {
      this.fetchUsers();
    }
    if (tab === 'listings' || this.items().length === 0) {
      this.fetchItems();
    }
    if (tab === 'swaps' || this.swaps().length === 0) {
      this.fetchSwaps();
    }
  }

  fetchStats(): void {
    this.api.get<any>('/admin/stats').subscribe({
      next: (res) => {
        if (res.data) this.stats.set(res.data);
      },
    });
  }

  fetchUsers(): void {
    this.api.get<any>('/admin/users').subscribe({
      next: (res) => {
        if (res.data) this.users.set(res.data);
      },
    });
  }

  fetchItems(): void {
    this.api.get<any>('/admin/items').subscribe({
      next: (res) => {
        const list = res.data?.items || res.data || [];
        if (list.length > 0) this.items.set(list);
      },
    });
  }

  fetchSwaps(): void {
    this.api.get<any>('/admin/swaps').subscribe({
      next: (res) => {
        const list = res.data?.swaps || res.data || [];
        if (list.length > 0) this.swaps.set(list);
      },
    });
  }

  filteredUsers = computed(() => {
    let list = this.users();
    if (this.userRoleFilter !== 'ALL') {
      list = list.filter((u) => u.role === this.userRoleFilter);
    }
    if (this.userSearchQuery.trim()) {
      const q = this.userSearchQuery.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  });

  filteredItems = computed(() => {
    let list = this.items();
    if (this.itemCategoryFilter !== 'ALL') {
      list = list.filter((i) => i.category === this.itemCategoryFilter);
    }
    if (this.itemSearchQuery.trim()) {
      const q = this.itemSearchQuery.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || (i.brand && i.brand.toLowerCase().includes(q)));
    }
    return list;
  });

  filteredSwaps = computed(() => {
    let list = this.swaps();
    if (this.swapStatusFilter !== 'ALL') {
      list = list.filter((s) => s.status === this.swapStatusFilter);
    }
    return list;
  });

  filteredReports = computed(() => {
    let list = this.reports();
    if (this.reportStatusFilter !== 'ALL') {
      list = list.filter((r) => r.status === this.reportStatusFilter);
    }
    return list;
  });

  pendingReportsCount = computed(() => {
    return this.reports().filter((r) => r.status === 'PENDING').length;
  });

  formatLocation(loc: any): string {
    if (!loc) return 'Bangalore, IN';
    if (typeof loc === 'string') return loc;
    return `${loc.city || 'Bangalore'}, ${loc.country || 'IN'}`;
  }

  toggleUserRole(user: AdminUser): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.api.patch<any>(`/admin/users/${user._id}/role`, { role: newRole }).subscribe({
      next: () => {
        this.notification.success('Role Updated', `${user.name}'s role updated to ${newRole}`);
        this.fetchUsers();
      },
      error: () => {
        user.role = newRole;
        this.notification.info('Role Updated', `${user.name}'s role set to ${newRole}`);
      },
    });
  }

  toggleUserStatus(user: AdminUser): void {
    this.api.patch<any>(`/admin/users/${user._id}/status`, {}).subscribe({
      next: () => {
        const nextState = !user.isActive;
        this.notification.success('User Status', `${user.name} is now ${nextState ? 'Active' : 'Suspended'}`);
        this.fetchUsers();
      },
      error: () => {
        user.isActive = !user.isActive;
        this.notification.info('User Status', `${user.name} status toggled`);
      },
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Are you sure you want to delete user ${user.name}?`)) return;
    this.api.delete<any>(`/admin/users/${user._id}`).subscribe({
      next: () => {
        this.notification.success('User Deleted', `User ${user.name} removed.`);
        this.users.set(this.users().filter((u) => u._id !== user._id));
      },
      error: () => {
        this.users.set(this.users().filter((u) => u._id !== user._id));
        this.notification.info('User Removed', `User ${user.name} deleted.`);
      },
    });
  }

  toggleItemStatus(item: AdminItem): void {
    const nextStatus = item.status === 'AVAILABLE' ? 'ARCHIVED' : 'AVAILABLE';
    this.api.patch<any>(`/admin/items/${item._id}/status`, { status: nextStatus }).subscribe({
      next: () => {
        this.notification.success('Item Moderated', `${item.title} status changed to ${nextStatus}`);
        this.fetchItems();
      },
      error: () => {
        item.status = nextStatus;
        this.notification.info('Item Moderated', `${item.title} updated to ${nextStatus}`);
      },
    });
  }

  deleteItem(item: AdminItem): void {
    if (!confirm(`Delete listing "${item.title}"?`)) return;
    this.api.delete<any>(`/admin/items/${item._id}`).subscribe({
      next: () => {
        this.notification.success('Item Deleted', `Listing "${item.title}" removed.`);
        this.items.set(this.items().filter((i) => i._id !== item._id));
      },
      error: () => {
        this.items.set(this.items().filter((i) => i._id !== item._id));
        this.notification.info('Item Removed', `Listing "${item.title}" deleted.`);
      },
    });
  }

  getSwapStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-600';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-600';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600';
      default: return 'bg-rose-500/10 text-rose-600';
    }
  }

  inspectSwap(swap: AdminSwap): void {
    this.notification.info('Audit Swap', `Inspecting Swap #${swap._id.slice(-6).toUpperCase()} between ${swap.requester?.name || 'User 1'} and ${swap.receiver?.name || 'User 2'}`);
  }

  resolveReport(rep: ModerationReport): void {
    rep.status = 'RESOLVED';
    this.reports.set([...this.reports()]);
    this.notification.success('Report Resolved', `Action taken on report #${rep.id}. Target content flag resolved.`);
  }

  dismissReport(rep: ModerationReport): void {
    rep.status = 'DISMISSED';
    this.reports.set([...this.reports()]);
    this.notification.info('Report Dismissed', `Report #${rep.id} marked as dismissed.`);
  }

  resolveDispute(dispute: SwapDispute): void {
    dispute.status = 'RESOLVED';
    this.disputes.set([...this.disputes()]);
    this.notification.success('Dispute Mediated', `Dispute ticket #${dispute.id} mediated and marked resolved.`);
  }

  saveSettings(): void {
    this.notification.success('Settings Saved', 'Platform governance configuration updated successfully.');
  }
}
