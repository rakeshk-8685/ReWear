import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwapService } from '../../../core/services/swap.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SwapRequest } from '../../../core/models/swap.model';

@Component({
  selector: 'app-shipping-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
          
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📦 Shipping & Logistics Hub</span>
              </h3>
              <p class="text-xs text-slate-400">Generate digital shipping label & record tracking details</p>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold">✕</button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <!-- Mode Selection Tab -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Delivery Mode</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  (click)="deliveryMode.set('COURIER')"
                  [class.border-emerald-500]="deliveryMode() === 'COURIER'"
                  [class.bg-emerald-500\/10]="deliveryMode() === 'COURIER'"
                  class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1 transition-all"
                >
                  <span class="text-lg">📦</span>
                  <span class="text-xs font-bold text-slate-900 dark:text-white">Courier</span>
                </button>
                <button
                  type="button"
                  (click)="deliveryMode.set('DROP_OFF')"
                  [class.border-emerald-500]="deliveryMode() === 'DROP_OFF'"
                  [class.bg-emerald-500\/10]="deliveryMode() === 'DROP_OFF'"
                  class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1 transition-all"
                >
                  <span class="text-lg">🚲</span>
                  <span class="text-xs font-bold text-slate-900 dark:text-white">Eco Drop-Off</span>
                </button>
                <button
                  type="button"
                  (click)="deliveryMode.set('HANDSHAKE')"
                  [class.border-emerald-500]="deliveryMode() === 'HANDSHAKE'"
                  [class.bg-emerald-500\/10]="deliveryMode() === 'HANDSHAKE'"
                  class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1 transition-all"
                >
                  <span class="text-lg">🤝</span>
                  <span class="text-xs font-bold text-slate-900 dark:text-white">In-Person</span>
                </button>
              </div>
            </div>

            <!-- Form -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Logistics Partner / Carrier</label>
                <select
                  [(ngModel)]="carrier"
                  class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="Delhivery">Delhivery Express</option>
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="FedEx">FedEx / India Post</option>
                  <option value="ReWear Eco Hub">ReWear City Eco Drop-Off Hub</option>
                  <option value="Self Handshake">In-Person Handshake Trade</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Waybill / Tracking Number</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="trackingNumber"
                    placeholder="e.g. RW-9874102-IN"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    (click)="generateAutoTracking()"
                    class="px-3 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-bold whitespace-nowrap hover:bg-emerald-500/20"
                  >
                    ⚡ Auto-Generate
                  </button>
                </div>
              </div>

              <!-- Digital Shipping Label Card Preview -->
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span>ReWear Digital Shipping Manifest</span>
                  <span>ID: {{ swap()?._id?.substring(0, 8) || 'RW-SWAP' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-black text-slate-900 dark:text-white">{{ carrier }}</p>
                    <p class="text-[10px] font-mono text-emerald-500 font-bold">{{ trackingNumber || 'Awaiting Tracking Assignment' }}</p>
                  </div>
                  <!-- Simulating QR Code -->
                  <div class="w-12 h-12 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center p-1">
                    <div class="w-full h-full border-2 border-dashed border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white dark:text-slate-900">
                      QR
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                (click)="closeModal()"
                class="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                [disabled]="isSubmitting() || !trackingNumber"
                (click)="submitShipping()"
                class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                @if (isSubmitting()) {
                  <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching...</span>
                } @else {
                  <span>🚀 Confirm & Dispatch Shipment</span>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `,
})
export class ShippingModalComponent {
  isOpen = input<boolean>(false);
  swap = input<SwapRequest | null>(null);
  modalClosed = output<void>();
  shippingUpdated = output<void>();

  private swapService = inject(SwapService);
  private notification = inject(NotificationService);

  deliveryMode = signal<'COURIER' | 'DROP_OFF' | 'HANDSHAKE'>('COURIER');
  carrier = 'Delhivery';
  trackingNumber = 'RW-' + Math.floor(1000000 + Math.random() * 9000000);
  isSubmitting = signal<boolean>(false);

  generateAutoTracking(): void {
    const prefix = this.carrier === 'BlueDart' ? 'BD' : this.carrier === 'DTDC' ? 'DT' : 'RW';
    this.trackingNumber = `${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}-IN`;
  }

  closeModal(): void {
    this.modalClosed.emit();
  }

  submitShipping(): void {
    const swapData = this.swap();
    if (!swapData || !this.trackingNumber) return;

    this.isSubmitting.set(true);
    this.swapService
      .updateShippingInfo(swapData._id, {
        carrier: this.carrier,
        trackingNumber: this.trackingNumber,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notification.success(
            'Shipment Dispatched! 📦',
            `Tracking info (${this.carrier}: ${this.trackingNumber}) attached to swap.`
          );
          this.shippingUpdated.emit();
          this.closeModal();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notification.error('Shipping Error', err.error?.message || 'Failed to record tracking info');
        },
      });
  }
}
