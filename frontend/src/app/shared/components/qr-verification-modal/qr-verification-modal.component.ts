import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-verification-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div class="glass-card max-w-md w-full p-8 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative">
        
        <!-- Close Button -->
        <button
          (click)="close.emit()"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
        >
          ✕
        </button>

        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🤝 In-Person Swap Verification
          </span>
          <h3 class="text-xl font-black text-slate-900 dark:text-white">Scan Local Handover QR</h3>
          <p class="text-xs text-slate-400">Show this QR code to your swap partner during handover to instantly verify garment exchange.</p>
        </div>

        <!-- Dynamic SVG QR Code Matrix -->
        <div class="p-6 bg-white rounded-3xl inline-block border-4 border-emerald-500/30 shadow-inner my-2">
          <svg class="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white" />
            <!-- Corner Position Markers -->
            <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
            <rect x="9" y="9" width="17" height="17" fill="white" />
            <rect x="13" y="13" width="9" height="9" fill="#10b981" />

            <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
            <rect x="74" y="9" width="17" height="17" fill="white" />
            <rect x="78" y="13" width="9" height="9" fill="#10b981" />

            <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
            <rect x="9" y="74" width="17" height="17" fill="white" />
            <rect x="13" y="78" width="9" height="9" fill="#10b981" />

            <!-- Random Encoded Data Grid Pattern -->
            <rect x="35" y="10" width="6" height="6" fill="#0f172a" />
            <rect x="45" y="10" width="6" height="6" fill="#10b981" />
            <rect x="55" y="15" width="6" height="6" fill="#0f172a" />

            <rect x="10" y="35" width="6" height="6" fill="#10b981" />
            <rect x="20" y="45" width="6" height="6" fill="#0f172a" />
            <rect x="35" y="35" width="12" height="12" fill="#0f172a" />
            <rect x="50" y="40" width="6" height="6" fill="#10b981" />

            <rect x="70" y="35" width="6" height="6" fill="#0f172a" />
            <rect x="80" y="45" width="6" height="6" fill="#10b981" />
            <rect x="85" y="55" width="6" height="6" fill="#0f172a" />

            <rect x="35" y="70" width="6" height="6" fill="#10b981" />
            <rect x="45" y="80" width="6" height="6" fill="#0f172a" />
            <rect x="60" y="75" width="12" height="12" fill="#0f172a" />

            <!-- ReWear Center Logo Emblem -->
            <rect x="40" y="40" width="20" height="20" rx="4" fill="#10b981" />
            <text x="45" y="54" fill="white" font-size="12" font-weight="bold">RW</text>
          </svg>
        </div>

        <div class="space-y-3">
          <div class="text-[11px] font-mono text-slate-400">
            Swap Code: <span class="text-emerald-500 font-bold">#{{ swapId.slice(-8) }}</span>
          </div>

          <button
            (click)="simulateScan()"
            class="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
          >
            ⚡ Simulate In-Person Scan Verification
          </button>
        </div>

      </div>
    </div>
  `,
})
export class QrVerificationModalComponent {
  @Input({ required: true }) swapId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<string>();

  simulateScan(): void {
    this.verified.emit(this.swapId);
  }
}
