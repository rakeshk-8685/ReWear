import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-dynamic-island',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Floating Live Activity Widget (Positioned cleanly at bottom-right to avoid blocking navbar) -->
    <div class="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      <div
        (mouseenter)="expanded.set(true)"
        (mouseleave)="expanded.set(false)"
        (click)="expanded.set(!expanded())"
        [class]="expanded() ? 'w-[300px] sm:w-[340px] p-4 rounded-3xl' : 'w-auto px-4 py-2.5 rounded-full'"
        class="bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl text-white border border-white/15 shadow-2xl transition-all duration-300 ease-out cursor-pointer hover:scale-[1.03] flex flex-col justify-center"
        role="region"
        aria-label="ReWear Live Activity Status"
      >
        <!-- Collapsed Compact Pill View -->
        @if (!expanded()) {
          <div class="flex items-center space-x-3 text-xs font-semibold select-none">
            <!-- Pulsing Signal Dot -->
            <div class="flex items-center space-x-1.5">
              <span class="relative flex h-2.5 w-2.5">
                <span [class]="socketService.isConnected() ? 'bg-emerald-400' : 'bg-amber-400'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                <span [class]="socketService.isConnected() ? 'bg-emerald-500' : 'bg-amber-500'" class="relative inline-flex rounded-full h-2.5 w-2.5"></span>
              </span>
              <span class="text-[11px] font-bold text-slate-200">ReWear Live</span>
            </div>

            <span class="text-slate-600">|</span>

            <!-- Unread Chat Pill or Eco Highlight -->
            @if (unreadCount() > 0) {
              <div class="flex items-center space-x-1 text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span class="text-[11px] font-extrabold">{{ unreadCount() }} New</span>
              </div>
            } @else {
              <div class="flex items-center space-x-1 text-slate-300">
                <span class="text-emerald-400 text-xs">🌱</span>
                <span class="text-[11px]">14.2k kg CO2 Saved</span>
              </div>
            }
          </div>
        } @else {
          <!-- Expanded Rich Activity View -->
          <div class="space-y-3 animate-spring-popup">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">
                  R
                </div>
                <span class="text-xs font-bold text-white tracking-wide">Live Swap Network</span>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {{ socketService.isConnected() ? 'Connected' : 'Connecting' }}
              </span>
            </div>

            <div class="flex items-center justify-between text-xs pt-1">
              <div>
                <p class="text-slate-400 text-[11px]">Unread Messages</p>
                <p class="text-sm font-black text-emerald-400">{{ unreadCount() }} Direct Chats</p>
              </div>
              <div class="text-right">
                <p class="text-slate-400 text-[11px]">User Status</p>
                <p class="text-xs font-bold text-white">{{ authService.currentUser()?.name || 'Guest Swapper' }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-2 pt-2">
              <a
                routerLink="/chat"
                class="flex-1 py-2 text-center rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
              >
                Open Messages
              </a>
              <a
                routerLink="/swaps"
                class="flex-1 py-2 text-center rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
              >
                Swap Dashboard
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DynamicIslandComponent implements OnInit, OnDestroy {
  socketService = inject(SocketService);
  authService = inject(AuthService);
  private chatService = inject(ChatService);

  expanded = signal<boolean>(false);
  unreadCount = signal<number>(0);

  private intervalId?: any;

  ngOnInit() {
    this.fetchUnread();
    this.intervalId = setInterval(() => {
      if (this.authService.isAuthenticated()) {
        this.fetchUnread();
      }
    }, 15000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private fetchUnread(): void {
    if (this.authService.isAuthenticated()) {
      this.chatService.getUnreadCount().subscribe({
        next: (res) => {
          if (res.data?.unreadCount !== undefined) {
            this.unreadCount.set(res.data.unreadCount);
          }
        },
      });
    }
  }
}
