import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SwapRequest, SwapStatus } from '../../../core/models/swap.model';
import { DEFAULT_ITEM_IMAGE, DEFAULT_USER_AVATAR } from '../../../core/services/item.service';

@Component({
  selector: 'app-swap-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl relative">
      
      <!-- Top Header & Fairness Score Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center space-x-3">
          <span class="text-xs font-bold text-slate-400">Offer #{{ swap?._id ? swap._id.slice(-6) : '000000' }}</span>
          <span
            class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
            [ngClass]="{
              'bg-amber-500/20 text-amber-500 border border-amber-500/30': swap?.status === 'PENDING',
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': swap?.status === 'ACCEPTED',
              'bg-blue-500/20 text-blue-400 border border-blue-500/30': swap?.status === 'COMPLETED',
              'bg-rose-500/20 text-rose-400 border border-rose-500/30': swap?.status === 'REJECTED' || swap?.status === 'CANCELLED'
            }"
          >
            {{ swap?.status || 'PENDING' }}
          </span>
        </div>

        <!-- Trade Fairness Score Pill -->
        <div class="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
          <span class="text-slate-400">Trade Balance:</span>
          <span [ngClass]="fairnessColorClass">{{ fairnessLabel }}</span>
        </div>
      </div>

      <!-- 4-Step Interactive Progress Stepper -->
      <div class="py-2">
        <div class="grid grid-cols-4 gap-2 text-center relative">
          <!-- Step 1 -->
          <div class="space-y-1">
            <div
              [class]="isStepActive(1) ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'"
              class="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-colors"
            >
              1
            </div>
            <span class="block text-[10px] font-bold text-slate-400">Proposed</span>
          </div>

          <!-- Step 2 -->
          <div class="space-y-1">
            <div
              [class]="isStepActive(2) ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'"
              class="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-colors"
            >
              2
            </div>
            <span class="block text-[10px] font-bold text-slate-400">Accepted</span>
          </div>

          <!-- Step 3 -->
          <div class="space-y-1">
            <div
              [class]="isStepActive(3) ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'"
              class="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-colors"
            >
              3
            </div>
            <span class="block text-[10px] font-bold text-slate-400">Shipped</span>
          </div>

          <!-- Step 4 -->
          <div class="space-y-1">
            <div
              [class]="isStepActive(4) ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'"
              class="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-colors"
            >
              4
            </div>
            <span class="block text-[10px] font-bold text-slate-400">Completed</span>
          </div>
        </div>
      </div>

      <!-- Trade Comparison Visuals (Offered vs Requested) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        
        <!-- Offered Items (From Requester) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-extrabold uppercase text-slate-400 tracking-wider">Offered Garments</span>
            <span class="text-slate-400">by {{ swap?.requester?.name || 'Swapper' }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <img [src]="swap?.offeredItems?.[0]?.images?.[0] || defaultItemImage" class="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-700 shrink-0" />
            <div class="truncate">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ swap?.offeredItems?.[0]?.title || 'Offered Item' }}</h4>
              <p class="text-xs text-emerald-500 font-bold">~&#36;{{ offeredTotalValue }}</p>
              <p class="text-[10px] text-slate-400">Size: {{ swap?.offeredItems?.[0]?.size || 'M' }} • {{ swap?.offeredItems?.[0]?.condition || 'Like New' }}</p>
            </div>
          </div>
        </div>

        <!-- Exchange Icon Divider -->
        <div class="hidden md:flex items-center justify-center">
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-lg">
            ⇄
          </div>
        </div>

        <!-- Target Requested Item -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-extrabold uppercase text-emerald-500 tracking-wider">Target Requested Garment</span>
            <span class="text-slate-400">from {{ swap?.receiver?.name || 'Swapper' }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <img [src]="swap?.requestedItem?.images?.[0] || defaultItemImage" class="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0" />
            <div class="truncate">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ swap?.requestedItem?.title || 'Target Item' }}</h4>
              <p class="text-xs text-emerald-500 font-bold">~&#36;{{ swap?.requestedItem?.valueEstimate || 0 }}</p>
              <p class="text-[10px] text-slate-400">Size: {{ swap?.requestedItem?.size || 'M' }} • {{ swap?.requestedItem?.condition || 'Like New' }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Buttons Footer -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <a [routerLink]="['/chat']" [queryParams]="{ swapId: swap?._id }" class="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200">
          💬 Message Swapper
        </a>

        <div class="flex items-center space-x-2">
          @if (swap?.status === 'PENDING') {
            @if (isReceiver) {
              <button
                (click)="counterOffer.emit(swap)"
                class="px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
              >
                📝 Counter Offer
              </button>
              <button
                (click)="updateStatus('REJECTED')"
                class="px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500/20 border border-rose-500/20"
              >
                Reject
              </button>
              <button
                (click)="updateStatus('ACCEPTED')"
                class="px-5 py-2 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-md hover:bg-emerald-600"
              >
                Accept Offer
              </button>
            } @else {
              <button
                (click)="updateStatus('CANCELLED')"
                class="px-4 py-2 rounded-full bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600"
              >
                Cancel Proposal
              </button>
            }
          }

          @if (swap?.status === 'ACCEPTED') {
            <button
              (click)="updateStatus('COMPLETED')"
              class="px-5 py-2 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-md hover:bg-emerald-600"
            >
              Mark Swap Completed & Rate Partner
            </button>
          }
        </div>
      </div>

    </div>
  `,
})
export class SwapCardComponent {
  @Input({ required: true }) swap!: SwapRequest;
  @Input() currentUserId?: string;

  @Output() statusChanged = new EventEmitter<{ id: string; status: SwapStatus }>();
  @Output() counterOffer = new EventEmitter<SwapRequest>();

  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;
  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;

  get isReceiver(): boolean {
    return !!this.currentUserId && this.currentUserId === this.swap?.receiver?._id;
  }

  get offeredTotalValue(): number {
    return (this.swap?.offeredItems || []).reduce((acc, item) => acc + (item?.valueEstimate || 0), 0);
  }

  get fairnessRatio(): number {
    const reqVal = this.swap?.requestedItem?.valueEstimate || 1;
    return Math.round((this.offeredTotalValue / reqVal) * 100);
  }

  get fairnessLabel(): string {
    const r = this.fairnessRatio;
    if (r >= 90 && r <= 110) return '100% Fair Trade';
    if (r > 110) return `Great Value (+${r - 100}%)`;
    return `Below Target (${r}%)`;
  }

  get fairnessColorClass(): string {
    const r = this.fairnessRatio;
    if (r >= 90 && r <= 110) return 'text-emerald-400';
    if (r > 110) return 'text-cyan-400';
    return 'text-amber-400';
  }

  isStepActive(step: number): boolean {
    const s = this.swap?.status;
    if (step === 1) return true; // Always proposed
    if (step === 2) return s === 'ACCEPTED' || s === 'COMPLETED';
    if (step === 3) return !!this.swap?.shippingInfo?.requesterTrackingNumber || s === 'COMPLETED';
    if (step === 4) return s === 'COMPLETED';
    return false;
  }

  updateStatus(status: SwapStatus): void {
    if (this.swap?._id) {
      this.statusChanged.emit({ id: this.swap._id, status });
    }
  }
}
