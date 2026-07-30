import { Component, inject, OnInit, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { QuickPreviewService } from '../../../core/services/quick-preview.service';

import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ItemCardComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="space-y-6 sm:space-y-8">
      
      <!-- Minimalist Fashion Marketplace Toolbar (~95px Height, Apple/Linear Minimalism) -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-3 sm:p-3.5 rounded-3xl shadow-sm space-y-2.5">
        
        <!-- Top Row: Primary Visual Search Bar & Compact Icon Controls -->
        <div class="flex items-center space-x-2.5">
          
          <!-- Primary Search Input (Dominant Visual Element) -->
          <div class="relative flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchInput($event)"
              placeholder="Search garments, brands (Nike, Levi's, Zara)..."
              class="w-full pl-10 pr-9 py-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-inner"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            @if (searchQuery) {
              <button (click)="clearSearch()" class="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-xs">
                ✕
              </button>
            }
          </div>

          <!-- Compact View Mode Icon Toggle Buttons -->
          <div class="flex items-center space-x-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 shrink-0">
            <button
              type="button"
              (click)="viewMode.set('grid')"
              [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="viewMode.set('map')"
              [class]="viewMode() === 'map' ? 'bg-emerald-500 text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              title="Local Map View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Compact Unified Filter & Sort Drawer Trigger -->
          <button
            type="button"
            (click)="filterDrawerOpen.set(true)"
            class="px-3.5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center space-x-1.5 shadow-xs hover:opacity-90 active:scale-95 transition-all shrink-0 min-h-[38px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="hidden sm:inline">Filter & Sort</span>
            <span class="sm:hidden">Filter</span>
            @if (activeFilterCount() > 0) {
              <span class="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-extrabold">
                {{ activeFilterCount() }}
              </span>
            }
          </button>

        </div>

        <!-- Bottom Row: Essential Category Chips Strip (Horizontal Scrollable) -->
        <div class="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-0.5">
          <button
            type="button"
            (click)="selectCategory('')"
            [class]="selectedCategory === ''
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold shadow-xs'
              : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'"
            class="px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all"
          >
            All
          </button>
          @for (cat of essentialCategories; track cat) {
            <button
              type="button"
              (click)="selectCategory(cat)"
              [class]="selectedCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold shadow-xs'
                : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'"
              class="px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Interactive Map View Mode -->
      @if (viewMode() === 'map') {
        <div class="glass-card rounded-4xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl animate-fade-in-up">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold uppercase tracking-wider">
                📍 Geo Proximity Radar
              </span>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Nearby Swappers & Garments</h2>
              <p class="text-xs text-slate-400">Click any location pin to preview pre-loved garments in Bangalore, Mumbai, Delhi & Noida</p>
            </div>
            <span class="text-xs font-bold text-emerald-500">Distance Radius: ~5 km</span>
          </div>

          <!-- Radar Map Container -->
          <div class="relative min-h-[420px] rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 p-6 flex flex-col justify-between">
            <!-- Grid Lines Background -->
            <div class="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

            <!-- Pins Radar Stream Grid -->
            <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (item of filteredItems(); track item._id + '-' + $index) {
                <div
                  (click)="openQuickPreview(item)"
                  class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/80 cursor-pointer transition-all hover:scale-105 shadow-lg group"
                >
                  <div class="flex items-center space-x-3">
                    <img [src]="item?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'" class="w-12 h-12 rounded-xl object-cover ring-1 ring-emerald-500/30 shrink-0" />
                    <div class="truncate">
                      <span class="text-[10px] font-bold text-emerald-400 uppercase">📍 {{ item?.location || 'Bangalore' }}</span>
                      <h4 class="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{{ item?.title || 'Clothing Item' }}</h4>
                      <p class="text-[10px] text-slate-400 font-medium">Est. ~₹{{ item?.valueEstimate || 0 }} • {{ item?.condition || 'Like New' }}</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Main Marketplace Grid View Mode -->
      @if (viewMode() === 'grid') {
        @if (loading()) {
          <app-skeleton-loader type="card" [count]="8"></app-skeleton-loader>
        } @else if (filteredItems().length === 0) {
          <app-empty-state
            title="No Matching Garments Found"
            description="Try broadening your search keywords or resetting your active category and brand filters."
            actionText="Reset Search Filters"
            (action)="resetFilters()"
          ></app-empty-state>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (item of filteredItems(); track item._id + '-' + $index) {
              <app-item-card
                [item]="item"
                (quickPreview)="openQuickPreview($event)"
              ></app-item-card>
            }
          </div>

          @if (loadingMore()) {
            <div class="py-6 text-center">
              <span class="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          }
        }
      }

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- Premium Garment Quick Preview Modal                          -->
      <!-- Cinematic two-column luxury product detail experience        -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      @if (previewModalOpen() && previewItem()) {
        <div
          class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 animate-backdrop-fade-in"
          style="background: rgba(2, 6, 23, 0.72); backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%);"
          (click)="previewModalOpen.set(false)"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="'Quick Preview: ' + (previewItem()?.title || 'Garment')"
        >
          <!-- Modal Card -->
          <div
            class="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto animate-modal-scale-in
                   bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl
                   rounded-t-[32px] md:rounded-[32px]
                   border border-slate-200/60 dark:border-white/[0.08]
                   shadow-[0_32px_80px_-12px_rgba(0,0,0,0.25),0_0_1px_0_rgba(0,0,0,0.05)]
                   dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)]"
            (click)="$event.stopPropagation()"
          >
            <!-- iOS Grab Handle (mobile only) -->
            <div class="flex justify-center pt-3 md:hidden">
              <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            </div>

            <!-- Premium Close Button -->
            <button
              (click)="previewModalOpen.set(false)"
              class="modal-close-btn absolute top-4 right-4 z-20
                     bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     hover:text-slate-900 dark:hover:text-white
                     shadow-md"
              aria-label="Close Preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Two-Column Layout -->
            <div class="flex flex-col md:flex-row">

              <!-- ═══ LEFT COLUMN: Product Gallery ═══ -->
              <div class="md:w-[440px] lg:w-[480px] shrink-0 p-5 md:p-7">

                <!-- Main Product Image with Hover Zoom -->
                <div class="preview-img-zoom rounded-[20px] aspect-[4/5] bg-slate-100 dark:bg-slate-800 animate-stagger-1">
                  <img
                    [src]="previewItem()?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'"
                    [alt]="previewItem()?.title || 'Garment'"
                    class="w-full h-full object-cover rounded-[20px]"
                    loading="eager"
                  />
                </div>

                <!-- Thumbnail Strip -->
                @if ((previewItem()?.images?.length || 0) > 1) {
                  <div class="flex items-center space-x-2 mt-3 animate-stagger-2">
                    @for (img of previewItem()!.images.slice(0, 4); track img; let i = $index) {
                      <button
                        (click)="selectPreviewImage(i)"
                        [class]="selectedPreviewImageIndex() === i
                          ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 opacity-100'
                          : 'opacity-60 hover:opacity-100'"
                        class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all duration-200"
                      >
                        <img [src]="img" class="w-full h-full object-cover" />
                      </button>
                    }
                    @if ((previewItem()?.images?.length || 0) > 4) {
                      <div class="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                        +{{ (previewItem()?.images?.length || 0) - 4 }}
                      </div>
                    }
                  </div>
                }

                <!-- Sustainability Impact Card -->
                <div class="mt-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 eco-glow animate-stagger-3">
                  <div class="flex items-center space-x-2 mb-3">
                    <div class="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Sustainability Impact</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-center p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50">
                      <p class="text-lg font-black text-emerald-600 dark:text-emerald-400">8.2 kg</p>
                      <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">CO₂ Saved</p>
                    </div>
                    <div class="text-center p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50">
                      <p class="text-lg font-black text-blue-600 dark:text-blue-400">2,700 L</p>
                      <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Water Saved</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ═══ RIGHT COLUMN: Product Information ═══ -->
              <div class="flex-1 p-5 md:p-7 md:pl-2 flex flex-col justify-between">

                <!-- Top Section: Title, Condition, Value -->
                <div class="space-y-5">

                  <!-- Condition Badge + Category -->
                  <div class="flex items-center space-x-2 animate-stagger-1">
                    <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider
                                 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ previewItem()?.condition || 'Like New' }}</span>
                    </span>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {{ previewItem()?.category || 'Tops' }}
                    </span>
                  </div>

                  <!-- Large Title -->
                  <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight animate-stagger-2">
                    {{ previewItem()?.title || 'Clothing Garment' }}
                  </h2>

                  <!-- Swap Value Highlight Card -->
                  <div class="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-800/30
                              border border-slate-200/80 dark:border-slate-700/50 animate-stagger-2">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Swap Value</p>
                      <p class="text-2xl font-black text-slate-900 dark:text-white">₹{{ previewItem()?.valueEstimate || 0 }}</p>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-stagger-3">
                    {{ previewItem()?.description || 'Pre-loved clothing item available for sustainable swap.' }}
                  </p>

                  <!-- Elegant Divider -->
                  <div class="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                  <!-- Product Metadata Grid -->
                  <div class="grid grid-cols-2 gap-3 animate-stagger-4">
                    <!-- Brand -->
                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                      <div class="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brand</p>
                        <p class="text-xs font-bold text-slate-900 dark:text-white">{{ previewItem()?.brand || 'Pre-Loved' }}</p>
                      </div>
                    </div>

                    <!-- Size -->
                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                      <div class="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Size</p>
                        <p class="text-xs font-bold text-slate-900 dark:text-white">{{ previewItem()?.size || 'M' }}</p>
                      </div>
                    </div>

                    <!-- Material -->
                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                      <div class="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Material</p>
                        <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ previewItem()?.material || 'Cotton Blend' }}</p>
                      </div>
                    </div>

                    <!-- Location -->
                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40">
                      <div class="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                        <p class="text-xs font-bold text-slate-900 dark:text-white">{{ previewItem()?.location || 'India' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Elegant Divider -->
                  <div class="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                  <!-- Owner Profile Card -->
                  <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 animate-stagger-5">
                    <div class="flex items-center space-x-3">
                      <div class="relative">
                        <img
                          [src]="previewItem()?.owner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
                          class="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                        />
                        <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-center space-x-1.5">
                          <p class="text-sm font-bold text-slate-900 dark:text-white">{{ previewItem()?.owner?.name || 'Verified Swapper' }}</p>
                          <span class="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 tracking-wider">Trusted</span>
                        </div>
                        <div class="flex items-center space-x-3 mt-0.5">
                          <span class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span class="font-bold">{{ previewItem()?.owner?.ratingAverage?.toFixed(1) || '5.0' }}</span>
                          </span>
                          <span class="text-[11px] text-slate-400">{{ previewItem()?.owner?.swapCount || 0 }} swaps</span>
                          <span class="text-[11px] text-slate-400 hidden sm:inline">~2h response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bottom Actions -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 mt-auto animate-stagger-6">
                  <a
                    [routerLink]="['/items', previewItem()!._id]"
                    (click)="previewModalOpen.set(false)"
                    class="btn-premium-cta flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-lg z-10"
                  >
                    <span>Propose Swap Offer</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <button
                    (click)="previewModalOpen.set(false)"
                    class="btn-ghost-premium flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span>Close</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      }

      <!-- Unified Filter & Sort Slide-Over Drawer -->
      @if (filterDrawerOpen()) {
        <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in" (click)="filterDrawerOpen.set(false)">
          <div class="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto shadow-2xl border-l border-slate-200 dark:border-slate-800" (click)="$event.stopPropagation()">
            
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Filter & Sort</h3>
                <p class="text-[11px] text-slate-400">Refine clothing results by fit, condition, and order</p>
              </div>
              <button (click)="filterDrawerOpen.set(false)" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div class="space-y-5">
              <!-- Sort Order Selection -->
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Sort By</label>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    (click)="selectedSort = 'newest'; fetchItems(true)"
                    [class]="selectedSort === 'newest' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                    class="px-4 py-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between"
                  >
                    <span>✨ Newest First</span>
                    @if (selectedSort === 'newest') { <span class="text-emerald-500 font-bold">✓</span> }
                  </button>
                  <button
                    type="button"
                    (click)="selectedSort = 'trending'; fetchItems(true)"
                    [class]="selectedSort === 'trending' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                    class="px-4 py-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between"
                  >
                    <span>🔥 Most Popular / Trending</span>
                    @if (selectedSort === 'trending') { <span class="text-emerald-500 font-bold">✓</span> }
                  </button>
                  <button
                    type="button"
                    (click)="selectedSort = 'highestValue'; fetchItems(true)"
                    [class]="selectedSort === 'highestValue' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                    class="px-4 py-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between"
                  >
                    <span>💎 Highest Estimated Value</span>
                    @if (selectedSort === 'highestValue') { <span class="text-emerald-500 font-bold">✓</span> }
                  </button>
                </div>
              </div>

              <!-- Gender Fit -->
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Gender Fit</label>
                <select [(ngModel)]="selectedGender" class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white">
                  <option value="">All Genders & Fits</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                </select>
              </div>

              <!-- Condition -->
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Condition</label>
                <select [(ngModel)]="selectedCondition" class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white">
                  <option value="">All Conditions</option>
                  <option value="New with Tags">New with Tags</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good Condition</option>
                </select>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button (click)="resetFilters()" class="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                Reset All
              </button>
              <button (click)="applyFilters(); filterDrawerOpen.set(false)" class="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class ItemListComponent implements OnInit, OnDestroy {
  private itemService = inject(ItemService);
  private route = inject(ActivatedRoute);

  items = signal<Item[]>([]);
  loading = signal<boolean>(true);
  loadingMore = signal<boolean>(false);
  hasMore = signal<boolean>(true);
  page = 1;

  viewMode = signal<'grid' | 'map'>('grid');

  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  selectedCategory = '';
  selectedGender = '';
  selectedCondition = '';
  selectedSort = 'newest';
  maxValue: number | null = null;

  filterDrawerOpen = signal<boolean>(false);
  previewModalOpen = signal<boolean>(false);
  previewItem = signal<Item | null>(null);
  selectedPreviewImageIndex = signal<number>(0);

  essentialCategories = ['Tops', 'Pants', 'Dresses', 'Shoes', 'Vintage'];
  categories = ['Tops', 'Pants', 'Outerwear', 'Dresses', 'Shoes', 'Accessories', 'Vintage'];
  popularSearchTags = ['Nike', 'Levi\'s', 'Zara', 'Bangalore', 'Mumbai', 'Noida', 'Uniqlo', 'Puma'];

  demoGarments: Item[] = [
    {
      _id: 'demo-1',
      title: 'Nike Sports Hoodie',
      description: 'Authentic fleece pullover Nike Sports Hoodie with embroidered swoosh logo. Ultra-soft fleece lining in pristine condition.',
      category: 'Tops',
      brand: 'Nike',
      gender: 'Unisex',
      size: 'L',
      condition: 'Like New',
      material: '80% Cotton / 20% Polyester',
      color: 'Heather Grey',
      valueEstimate: 140,
      location: 'Bangalore',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['nike', 'hoodie', 'sports', 'streetwear'],
      status: 'AVAILABLE',
      likesCount: 24,
      likedBy: [],
      viewsCount: 185,
      owner: { _id: 'u1', name: 'Aarav Sharma', email: 'alex@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.9, ratingCount: 12, swapCount: 14 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-2',
      title: "Levi's 501 Jeans",
      description: "Classic 100% cotton rigid Levi's 501 Original Fit denim jeans. Authentic indigo wash with classic red tab detail.",
      category: 'Pants',
      brand: "Levi's",
      gender: 'Men',
      size: '32x32',
      condition: 'Like New',
      material: '100% Cotton Denim',
      color: 'Dark Indigo',
      valueEstimate: 110,
      location: 'Mumbai',
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['levis', '501', 'jeans', 'denim'],
      status: 'AVAILABLE',
      likesCount: 38,
      likedBy: [],
      viewsCount: 290,
      owner: { _id: 'u2', name: 'Rohan Gupta', email: 'jordan@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.8, ratingCount: 8, swapCount: 9 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-3',
      title: 'Zara Linen Shirt',
      description: 'Breathable 100% organic Zara linen button-down casual shirt. Perfect relaxed fit for warm summer weather.',
      category: 'Tops',
      brand: 'Zara',
      gender: 'Women',
      size: 'M',
      condition: 'Like New',
      material: '100% Pure Linen',
      color: 'Pure White',
      valueEstimate: 85,
      location: 'Noida',
      images: [
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['zara', 'linen', 'shirt', 'summer'],
      status: 'AVAILABLE',
      likesCount: 16,
      likedBy: [],
      viewsCount: 120,
      owner: { _id: 'u3', name: 'Ananya Kapoor', email: 'maya@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.95, ratingCount: 15, swapCount: 19 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-4',
      title: 'H&M Oversized Hoodie',
      description: 'Cozy relaxed fit H&M oversized drop-shoulder hoodie in muted sage green. Thick heavy fabric with front pouch pocket.',
      category: 'Tops',
      brand: 'H&M',
      gender: 'Unisex',
      size: 'XL',
      condition: 'Like New',
      material: 'Organic Cotton Blend',
      color: 'Sage Green',
      valueEstimate: 65,
      location: 'Bangalore',
      images: [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['hm', 'hoodie', 'oversized', 'cozy'],
      status: 'AVAILABLE',
      likesCount: 29,
      likedBy: [],
      viewsCount: 210,
      owner: { _id: 'u1', name: 'Aarav Sharma', email: 'alex@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.9, ratingCount: 12, swapCount: 14 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-5',
      title: 'Uniqlo Jacket',
      description: 'Ultra Light Down Uniqlo Jacket with water-repellent coating and packable carrying pouch. Lightweight warmth.',
      category: 'Outerwear',
      brand: 'Uniqlo',
      gender: 'Unisex',
      size: 'L',
      condition: 'Like New',
      material: 'Nylon / Down Fill',
      color: 'Matte Black',
      valueEstimate: 125,
      location: 'Delhi',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['uniqlo', 'jacket', 'outerwear', 'down'],
      status: 'AVAILABLE',
      likesCount: 21,
      likedBy: [],
      viewsCount: 165,
      owner: { _id: 'u4', name: 'Priya Patel', email: 'admin@rewear.com', role: 'ADMIN', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', ratingAverage: 5.0, ratingCount: 24, swapCount: 28 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-6',
      title: 'Adidas Running Shorts',
      description: 'Lightweight breathable Adidas AEROREADY athletic running shorts with mesh liner and reflective accents.',
      category: 'Pants',
      brand: 'Adidas',
      gender: 'Men',
      size: 'M',
      condition: 'Like New',
      material: 'Recycled Polyester',
      color: 'Navy Blue',
      valueEstimate: 50,
      location: 'Mumbai',
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['adidas', 'shorts', 'running', 'sportswear'],
      status: 'AVAILABLE',
      likesCount: 14,
      likedBy: [],
      viewsCount: 105,
      owner: { _id: 'u2', name: 'Rohan Gupta', email: 'jordan@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.8, ratingCount: 8, swapCount: 9 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-7',
      title: 'Puma Sweatshirt',
      description: 'Classic Puma Essentials crewneck sweatshirt with retro embroidered logo chest print. Soft fleece interior.',
      category: 'Tops',
      brand: 'Puma',
      gender: 'Women',
      size: 'S',
      condition: 'Like New',
      material: 'Cotton Polyester',
      color: 'Burgundy',
      valueEstimate: 75,
      location: 'Noida',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['puma', 'sweatshirt', 'crewneck'],
      status: 'AVAILABLE',
      likesCount: 18,
      likedBy: [],
      viewsCount: 140,
      owner: { _id: 'u3', name: 'Ananya Kapoor', email: 'maya@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.95, ratingCount: 15, swapCount: 19 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'demo-8',
      title: 'Puma Retro Track Jacket',
      description: 'Vintage-style Puma T7 zip-up track jacket with iconic side stripe taping. Excellent condition with smooth zipper.',
      category: 'Outerwear',
      brand: 'Puma',
      gender: 'Unisex',
      size: 'M',
      condition: 'Excellent',
      material: 'Polyester Tricot',
      color: 'Black / White',
      valueEstimate: 95,
      location: 'Hyderabad',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['puma', 'tracksuit', 'vintage', 'streetwear'],
      status: 'AVAILABLE',
      likesCount: 31,
      likedBy: [],
      viewsCount: 230,
      owner: { _id: 'u1', name: 'Aarav Sharma', email: 'alex@rewear.com', role: 'USER', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', ratingAverage: 4.9, ratingCount: 12, swapCount: 14 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  ngOnInit() {
    this.searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.fetchItems(true);
      });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.fetchItems(true);
    });
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
      if (!this.loading() && !this.loadingMore() && this.hasMore()) {
        this.loadNextPage();
      }
    }
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  applySearchTag(tag: string): void {
    this.searchQuery = tag;
    this.fetchItems(true);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.fetchItems(true);
  }

  fetchItems(reset: boolean = false): void {
    if (reset) {
      this.page = 1;
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }

    const params: any = {
      page: this.page,
      limit: 12,
      search: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      gender: this.selectedGender || undefined,
      condition: this.selectedCondition || undefined,
      sort: this.selectedSort,
    };

    this.itemService.getItems(params).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.loadingMore.set(false);
        if (res.data && res.data.length > 0) {
          if (reset) {
            this.items.set(res.data);
          } else {
            this.items.set([...this.items(), ...res.data]);
          }
          this.hasMore.set(res.data.length >= 12);
        } else {
          if (reset) {
            this.items.set(this.demoGarments);
          }
          this.hasMore.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
        this.loadingMore.set(false);
        if (reset && this.items().length === 0) {
          this.items.set(this.demoGarments);
        }
      },
    });
  }

  filteredItems(): Item[] {
    let list = this.items();
    if (this.selectedCategory) {
      list = list.filter((i) => i.category.toLowerCase().includes(this.selectedCategory.toLowerCase()));
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q) || (i.location && i.location.toLowerCase().includes(q)));
    }
    if (this.selectedGender) {
      list = list.filter((i) => i.gender.toLowerCase() === this.selectedGender.toLowerCase());
    }
    if (this.selectedCondition) {
      list = list.filter((i) => i.condition.toLowerCase().includes(this.selectedCondition.toLowerCase()));
    }
    if (list.length === 0 && this.demoGarments.length > 0) {
      return this.demoGarments.filter((i) => !this.selectedCategory || i.category.toLowerCase().includes(this.selectedCategory.toLowerCase()));
    }
    return list;
  }

  loadNextPage(): void {
    this.page++;
    this.fetchItems(false);
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.fetchItems(true);
  }

  applyFilters(): void {
    this.fetchItems(true);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedGender = '';
    this.selectedCondition = '';
    this.selectedSort = 'newest';
    this.maxValue = null;
    this.fetchItems(true);
  }

  activeFilterCount(): number {
    let count = 0;
    if (this.selectedGender) count++;
    if (this.selectedCondition) count++;
    if (this.maxValue) count++;
    if (this.selectedSort && this.selectedSort !== 'newest') count++;
    return count;
  }

  private quickPreviewService = inject(QuickPreviewService);

  openQuickPreview(item: Item): void {
    this.quickPreviewService.open(item);
  }

  selectPreviewImage(index: number): void {
    this.selectedPreviewImageIndex.set(index);
    const item = this.previewItem();
    if (item?.images?.[index]) {
      // Update the main preview image by reordering the images array
      // so the selected image is at index 0 for the main display
      const reordered = [...item.images];
      const selected = reordered.splice(index, 1)[0];
      reordered.unshift(selected);
      this.previewItem.set({ ...item, images: reordered });
      this.selectedPreviewImageIndex.set(0);
    }
  }

  @HostListener('window:keydown.escape')
  onEscapeKey(): void {
    if (this.previewModalOpen()) {
      this.previewModalOpen.set(false);
    } else if (this.filterDrawerOpen()) {
      this.filterDrawerOpen.set(false);
    }
  }
}
