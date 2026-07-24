import { Component, inject, OnInit, signal, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SwapService } from '../../../core/services/swap.service';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SwapRequest } from '../../../core/models/swap.model';
import { ChatMessage } from '../../../core/models/chat.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { DEFAULT_USER_AVATAR, DEFAULT_ITEM_IMAGE } from '../../../core/services/item.service';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TimeAgoPipe, ImageFallbackDirective],
  template: `
    <div class="h-[82vh] max-w-7xl mx-auto rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row">
      
      <!-- Left Sidebar: Conversations Stream -->
      <div class="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
        <div class="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 dark:text-white">Swap Messages</h2>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-xs">
              {{ swaps().length }} Active
            </span>
          </div>
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search conversations or swappers..."
              class="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span class="absolute right-3 top-2.5 text-xs text-slate-400">🔍</span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          @if (loadingSwaps()) {
            <div class="p-8 text-center text-xs text-slate-400">Loading active swap chats...</div>
          } @else if (filteredSwaps.length === 0) {
            <div class="p-8 text-center space-y-2">
              <span class="text-3xl">💬</span>
              <p class="text-xs font-bold text-slate-400">No active swap conversations yet</p>
            </div>
          } @else {
            @for (swap of filteredSwaps; track swap._id) {
              <button
                (click)="selectConversation(swap)"
                [class]="activeSwap()?._id === swap._id ? 'bg-emerald-500/15 border-l-4 border-emerald-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'"
                class="w-full p-4 text-left transition-all flex items-center space-x-3"
              >
                <div class="relative">
                  <img
                    [src]="getPartner(swap)?.avatarUrl || defaultUserAvatar"
                    appImageFallback
                    class="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <span class="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0"></span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ getPartner(swap)?.name || 'Swapper' }}</h4>
                    <span class="text-[10px] text-slate-400">{{ swap.updatedAt | timeAgo }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 truncate">
                    Re: {{ swap?.requestedItem?.title || 'Clothing Item' }}
                  </p>
                </div>
              </button>
            }
          }
        </div>
      </div>

      <!-- Right Main Window: iMessage Chat Window -->
      @if (activeSwap()) {
        <div class="flex-1 flex flex-col bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl relative">
          
          <!-- iMessage Top Header & Trade Context Card -->
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img
                  [src]="getPartner(activeSwap()!)?.avatarUrl || defaultUserAvatar"
                  appImageFallback
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-slate-900"></span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ getPartner(activeSwap()!)?.name || 'Swapper' }}</h3>
                <span class="text-[10px] text-emerald-500 font-bold">● Online Now</span>
              </div>
            </div>

            <!-- Trade Context Banner -->
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span class="text-slate-400">Trade Item:</span>
              <span class="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{{ activeSwap()?.requestedItem?.title || 'Target Item' }}</span>
              <a [routerLink]="['/swaps']" class="text-emerald-500 font-bold text-[10px] uppercase hover:underline">View Offer</a>
            </div>
          </div>

          <!-- Pinned Message Banner -->
          @if (pinnedMessage()) {
            <div class="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-600 dark:text-amber-300 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span>📌</span>
                <span class="font-bold">Pinned:</span>
                <span class="truncate max-w-md">{{ pinnedMessage()?.message }}</span>
              </div>
              <button (click)="pinnedMessage.set(null)" class="text-xs font-bold text-slate-400">×</button>
            </div>
          }

          <!-- Chat Stream Messages -->
          <div #chatContainer class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            @if (loadingMessages()) {
              <div class="text-center py-12 text-xs text-slate-400">Loading messages...</div>
            } @else if (messages().length === 0) {
              <div class="text-center py-12 space-y-2">
                <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                  👋
                </div>
                <p class="text-xs text-slate-400">No messages yet. Say hello and discuss trade delivery!</p>
              </div>
            } @else {
              @for (msg of messages(); track msg._id) {
                <div
                  [class]="isMyMessage(msg) ? 'justify-end' : 'justify-start'"
                  class="flex items-end space-x-2 group"
                >
                  @if (!isMyMessage(msg)) {
                    <img [src]="getPartner(activeSwap()!)?.avatarUrl || defaultUserAvatar" appImageFallback class="w-7 h-7 rounded-full object-cover mb-1" />
                  }

                  <div class="space-y-1 max-w-[75%]">
                    <!-- Message Bubble -->
                    <div
                      [class]="isMyMessage(msg) ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl rounded-br-sm shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl rounded-bl-sm border border-slate-200 dark:border-slate-700'"
                      class="px-4 py-2.5 text-xs sm:text-sm leading-relaxed relative"
                    >
                      <p>{{ msg.message }}</p>

                      @if (msg.imageUrl) {
                        <img [src]="msg.imageUrl" appImageFallback class="mt-2 rounded-xl max-h-48 object-cover" />
                      }

                      <div class="flex items-center justify-end space-x-1 mt-1 text-[9px] opacity-75">
                        <span>{{ msg.createdAt | timeAgo }}</span>
                        @if (isMyMessage(msg)) {
                          <span>{{ msg.read ? '✓✓' : '✓' }}</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Typing Indicator -->
          @if (isPartnerTyping()) {
            <div class="px-6 py-1 text-[11px] text-emerald-500 font-bold animate-pulse">
              ✍️ {{ getPartner(activeSwap()!)?.name || 'Swapper' }} is typing...
            </div>
          }

          <!-- Quick Trade Action Chip Presets -->
          <div class="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
            <button
              type="button"
              (click)="sendMessage('Is this garment still available for swap?')"
              class="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors shrink-0"
            >
              👋 Available for swap?
            </button>
            <button
              type="button"
              (click)="shareCurrentLocation()"
              class="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors shrink-0"
            >
              📍 Share Location
            </button>
            <button
              type="button"
              (click)="sendMessage('What is the exact chest/waist measurement?')"
              class="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors shrink-0"
            >
              📐 Ask Size Measurements
            </button>
          </div>

          <!-- Input Bar Container -->
          <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2">
            <label class="cursor-pointer p-2 text-slate-400 hover:text-emerald-500 transition-colors">
              <input type="file" accept="image/*" (change)="onPhotoAttached($event)" class="hidden" />
              📷
            </label>

            <input
              type="text"
              [(ngModel)]="newMessageText"
              (input)="onTypingInput()"
              (keyup.enter)="sendMessage()"
              placeholder="Type message or trade question..."
              class="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="button"
              (click)="sendMessage()"
              [disabled]="!newMessageText.trim() && !attachedImageUrl"
              class="px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              Send 🚀
            </button>
          </div>

        </div>
      } @else {
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
          <div class="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-2xl">
            💬
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Select a Swap Conversation</h3>
          <p class="text-xs text-slate-400 max-w-sm">Choose a swapper from the left sidebar to start negotiating clothing trades.</p>
        </div>
      }

    </div>
  `,
})
export class ChatInboxComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer?: ElementRef;

  private swapService = inject(SwapService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private socketService = inject(SocketService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);

  readonly defaultUserAvatar = DEFAULT_USER_AVATAR;
  readonly defaultItemImage = DEFAULT_ITEM_IMAGE;

  swaps = signal<SwapRequest[]>([]);
  activeSwap = signal<SwapRequest | null>(null);
  messages = signal<ChatMessage[]>([]);
  pinnedMessage = signal<ChatMessage | null>(null);
  
  loadingSwaps = signal<boolean>(true);
  loadingMessages = signal<boolean>(false);
  isPartnerTyping = signal<boolean>(false);

  searchQuery = '';
  newMessageText = '';
  attachedImageUrl = '';
  private typingTimeout: any;

  ngOnInit() {
    this.socketService.connect();

    this.swapService.getMySwaps().subscribe({
      next: (res: any) => {
        this.loadingSwaps.set(false);
        if (res?.data) {
          this.swaps.set(res.data);
          
          const paramSwapId = this.route.snapshot.queryParams['swapId'];
          if (paramSwapId) {
            const found = res.data.find((s: SwapRequest) => s._id === paramSwapId);
            if (found) this.selectConversation(found);
          } else if (res.data.length > 0) {
            this.selectConversation(res.data[0]);
          }
        }
      },
      error: () => this.loadingSwaps.set(false),
    });

    this.socketService.onNewMessage().subscribe((msg: ChatMessage) => {
      if (this.activeSwap() && msg.swapRequestId === this.activeSwap()!._id) {
        this.messages.update((prev) => [...prev, msg]);
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  get filteredSwaps(): SwapRequest[] {
    if (!this.searchQuery.trim()) return this.swaps();
    const q = this.searchQuery.toLowerCase();
    return this.swaps().filter((s) => {
      const partner = this.getPartner(s);
      return (
        partner?.name?.toLowerCase().includes(q) ||
        s?.requestedItem?.title?.toLowerCase().includes(q)
      );
    });
  }

  selectConversation(swap: SwapRequest): void {
    this.activeSwap.set(swap);
    this.loadingMessages.set(true);

    this.chatService.getChatHistory(swap._id).subscribe({
      next: (res: any) => {
        this.loadingMessages.set(false);
        if (res?.data) {
          this.messages.set(res.data);
          this.scrollToBottom();
        }
      },
      error: () => this.loadingMessages.set(false),
    });
  }

  getPartner(swap?: SwapRequest | null) {
    const fallbackUser = {
      _id: 'unknown',
      name: 'Verified Swapper',
      avatarUrl: DEFAULT_USER_AVATAR,
    };
    if (!swap || !swap.requester || !swap.receiver) return fallbackUser;

    const currentUserId = this.authService.currentUser()?._id;
    return swap.requester._id === currentUserId ? swap.receiver : swap.requester;
  }

  isMyMessage(msg: ChatMessage): boolean {
    const currentUserId = this.authService.currentUser()?._id;
    return typeof msg.sender === 'object' ? msg.sender?._id === currentUserId : msg.sender === currentUserId;
  }

  onTypingInput(): void {
    const swap = this.activeSwap();
    if (!swap) return;

    this.socketService.sendMessage(swap._id, '');
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isPartnerTyping.set(false);
    }, 2000);
  }

  shareCurrentLocation(): void {
    this.sendMessage('📍 Bangalore, KA');
  }

  onPhotoAttached(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.attachedImageUrl = e.target.result as string;
          this.sendMessage();
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  sendMessage(overrideMsg?: string): void {
    const text = overrideMsg || this.newMessageText;
    const swap = this.activeSwap();
    if ((!text.trim() && !this.attachedImageUrl) || !swap) return;

    const payload = {
      swapRequestId: swap._id,
      message: text,
      imageUrl: this.attachedImageUrl || undefined,
    };

    this.chatService.sendMessage(payload).subscribe({
      next: (res: any) => {
        if (res?.success && res?.data) {
          this.messages.update((prev) => [...prev, res.data!]);
          this.newMessageText = '';
          this.attachedImageUrl = '';
          this.scrollToBottom();
        }
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
