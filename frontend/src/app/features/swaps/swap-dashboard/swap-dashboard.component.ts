import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwapCardComponent } from '../../../shared/components/swap-card/swap-card.component';
import { BottomSheetComponent } from '../../../shared/components/bottom-sheet/bottom-sheet.component';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { SwapService } from '../../../core/services/swap.service';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SwapRequest, SwapStatus } from '../../../core/models/swap.model';

@Component({
  selector: 'app-swap-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SwapCardComponent, BottomSheetComponent, RatingStarsComponent],
  template: `
    <div class="space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Clothing Swap Dashboard</h1>
          <p class="text-sm text-slate-500">Track pending trade offers, active exchanges, and shipping info</p>
        </div>

        <!-- Filter Tab Pills -->
        <div class="flex items-center space-x-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-full self-start">
          <button
            (click)="activeTab.set('all')"
            [class]="activeTab() === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
          >
            All Swaps
          </button>
          <button
            (click)="activeTab.set('pending')"
            [class]="activeTab() === 'pending' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
          >
            Pending ({{ pendingCount() }})
          </button>
          <button
            (click)="activeTab.set('accepted')"
            [class]="activeTab() === 'accepted' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
          >
            Accepted
          </button>
          <button
            (click)="activeTab.set('completed')"
            [class]="activeTab() === 'completed' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
          >
            Completed
          </button>
        </div>
      </div>

      <!-- Swaps List / Empty State -->
      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      } @else if (filteredSwaps().length === 0) {
        <div class="glass-card rounded-3xl p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No Swap Proposals Found</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Browse the clothing feed and propose a swap offer on items you love!</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-6">
          @for (swap of filteredSwaps(); track swap._id) {
            <div class="space-y-3">
              <app-swap-card
                [swap]="swap"
                [currentUserId]="authService.currentUser()?._id"
                (statusChanged)="onStatusChange($event)"
                (counterOffer)="openCounterOfferModal($event)"
              />

              <!-- Shipping Info Quick Actions for Accepted Swaps -->
              @if (swap.status === 'ACCEPTED' || swap.status === 'COMPLETED') {
                <div class="flex items-center justify-between p-3.5 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div class="flex items-center space-x-2">
                    <span class="text-base">📦</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400">Shipping Tracking:</span>
                    <span class="text-slate-600 dark:text-slate-300">
                      {{ getShippingStatus(swap) }}
                    </span>
                  </div>
                  <button
                    (click)="openShippingModal(swap)"
                    class="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-sm hover:bg-emerald-400"
                  >
                    Update Carrier Info
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Counter Offer Bottom Sheet Modal -->
      <app-bottom-sheet
        [isOpen]="counterModalOpen()"
        title="Send Counter Offer Note"
        subtitle="Request item adjustments or negotiate trade terms with the swapper"
        (close)="counterModalOpen.set(false)"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Counter Offer Message</label>
            <textarea
              [(ngModel)]="counterNote"
              rows="3"
              placeholder="e.g. Could you also add the vintage scarf to make this trade equal value?"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-2">
            <button (click)="counterModalOpen.set(false)" class="px-4 py-2 rounded-full text-xs font-bold text-slate-400">Cancel</button>
            <button (click)="submitCounterOffer()" class="px-5 py-2 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md">
              Send Counter Note
            </button>
          </div>
        </div>
      </app-bottom-sheet>

      <!-- 5-Star Karma Review Bottom Sheet Modal -->
      <app-bottom-sheet
        [isOpen]="reviewModalOpen()"
        title="Rate & Review Swap Partner"
        subtitle="Submit your verified Swap Karma review score"
        (close)="reviewModalOpen.set(false)"
      >
        <div class="space-y-5 text-center">
          <div class="flex items-center justify-center space-x-2 py-2">
            <app-rating-stars [rating]="reviewRating" (ratingChange)="reviewRating = $event" [readonly]="false" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Review Feedback Comment</label>
            <textarea
              [(ngModel)]="reviewComment"
              rows="3"
              placeholder="e.g. Garment arrived fast and in perfect condition as described!"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-left"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-2">
            <button (click)="reviewModalOpen.set(false)" class="px-4 py-2 rounded-full text-xs font-bold text-slate-400">Cancel</button>
            <button (click)="submitReviewScore()" class="px-6 py-2.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md">
              Submit Review Score
            </button>
          </div>
        </div>
      </app-bottom-sheet>

      <!-- Shipping Info Bottom Sheet Modal -->
      <app-bottom-sheet
        [isOpen]="shippingModalOpen()"
        title="Update Shipping Carrier & Tracking Number"
        subtitle="Provide postal tracking numbers so your swap partner can follow delivery"
        (close)="shippingModalOpen.set(false)"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Carrier Name</label>
            <input
              type="text"
              [(ngModel)]="carrier"
              placeholder="e.g. USPS, FedEx, DHL, UPS"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tracking Number</label>
            <input
              type="text"
              [(ngModel)]="trackingNumber"
              placeholder="e.g. 9400 1000 0000 0000 0000 00"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
            />
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button (click)="shippingModalOpen.set(false)" class="px-4 py-2 rounded-full text-xs font-bold text-slate-400">
              Cancel
            </button>
            <button
              (click)="submitShippingInfo()"
              [disabled]="!carrier.trim() || !trackingNumber.trim()"
              class="px-5 py-2 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              Save Tracking Info
            </button>
          </div>
        </div>
      </app-bottom-sheet>

    </div>
  `,
})
export class SwapDashboardComponent implements OnInit, OnDestroy {
  private swapService = inject(SwapService);
  authService = inject(AuthService);
  private socketService = inject(SocketService);
  private notification = inject(NotificationService);

  swaps = signal<SwapRequest[]>([]);
  loading = signal<boolean>(true);
  activeTab = signal<'all' | 'pending' | 'accepted' | 'completed'>('all');

  shippingModalOpen = signal<boolean>(false);
  counterModalOpen = signal<boolean>(false);
  reviewModalOpen = signal<boolean>(false);

  selectedSwap = signal<SwapRequest | null>(null);

  carrier = '';
  trackingNumber = '';
  counterNote = '';

  reviewRating = 5;
  reviewComment = '';

  ngOnInit() {
    this.fetchSwaps();
    this.socketService.listen<any>('swap_updated').subscribe(() => {
      this.fetchSwaps();
    });
  }

  ngOnDestroy() {}

  fetchSwaps(): void {
    this.loading.set(true);
    this.swapService.getMySwaps().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.swaps.set(res.data);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  pendingCount(): number {
    return this.swaps().filter((s) => s.status === 'PENDING').length;
  }

  filteredSwaps(): SwapRequest[] {
    const tab = this.activeTab();
    if (tab === 'pending') return this.swaps().filter((s) => s.status === 'PENDING');
    if (tab === 'accepted') return this.swaps().filter((s) => s.status === 'ACCEPTED');
    if (tab === 'completed') return this.swaps().filter((s) => s.status === 'COMPLETED');
    return this.swaps();
  }

  getShippingStatus(swap: SwapRequest): string {
    const info = swap.shippingInfo;
    if (!info) return 'Pending tracking submission';
    if (info.requesterTrackingNumber || info.receiverTrackingNumber) {
      return `Carrier: ${info.requesterCarrier || info.receiverCarrier || 'Postal'} • Tracking: ${info.requesterTrackingNumber || info.receiverTrackingNumber}`;
    }
    return 'Pending tracking submission';
  }

  openShippingModal(swap: SwapRequest): void {
    this.selectedSwap.set(swap);
    this.carrier = swap.shippingInfo?.requesterCarrier || swap.shippingInfo?.receiverCarrier || '';
    this.trackingNumber = swap.shippingInfo?.requesterTrackingNumber || swap.shippingInfo?.receiverTrackingNumber || '';
    this.shippingModalOpen.set(true);
  }

  submitShippingInfo(): void {
    const swap = this.selectedSwap();
    if (!swap || !this.carrier.trim() || !this.trackingNumber.trim()) return;

    this.swapService.updateShippingInfo(swap._id, { carrier: this.carrier, trackingNumber: this.trackingNumber }).subscribe({
      next: (res) => {
        this.shippingModalOpen.set(false);
        if (res.success) {
          this.notification.success('Shipping Saved', 'Tracking information updated successfully.');
          this.fetchSwaps();
        }
      },
    });
  }

  openCounterOfferModal(swap: SwapRequest): void {
    this.selectedSwap.set(swap);
    this.counterNote = '';
    this.counterModalOpen.set(true);
  }

  submitCounterOffer(): void {
    this.counterModalOpen.set(false);
    this.notification.success('Counter Note Sent', 'Your counter proposal message was delivered.');
  }

  onStatusChange(event: { id: string; status: SwapStatus }): void {
    const swap = this.swaps().find((s) => s._id === event.id);
    if (event.status === 'COMPLETED' && swap) {
      this.selectedSwap.set(swap);
      this.reviewRating = 5;
      this.reviewComment = '';
      this.reviewModalOpen.set(true);
    } else {
      this.swapService.updateSwapStatus(event.id, event.status).subscribe({
        next: (res) => {
          if (res.success) {
            this.notification.success('Swap Status Updated', `Swap status changed to ${event.status}`);
            this.fetchSwaps();
          }
        },
      });
    }
  }

  submitReviewScore(): void {
    const swap = this.selectedSwap();
    if (!swap) return;

    this.swapService.updateSwapStatus(swap._id, 'COMPLETED').subscribe({
      next: (res) => {
        this.reviewModalOpen.set(false);
        if (res.success) {
          this.notification.success('Swap Completed & Rated', `Submitted ${this.reviewRating}-star Karma review!`);
          this.fetchSwaps();
        }
      },
    });
  }
}
