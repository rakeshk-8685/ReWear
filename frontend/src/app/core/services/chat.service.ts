import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(ApiService);

  sendMessage(payload: { swapRequestId: string; message: string; imageUrl?: string; location?: string }): Observable<ApiResponse<ChatMessage>> {
    return this.api.post<ChatMessage>('/chat/messages', payload);
  }

  getChatHistory(swapId: string): Observable<ApiResponse<ChatMessage[]>> {
    return this.api.get<ChatMessage[]>(`/chat/messages/${swapId}`);
  }

  getSwapMessages(swapId: string): Observable<ApiResponse<ChatMessage[]>> {
    return this.getChatHistory(swapId);
  }

  getUnreadCount(): Observable<ApiResponse<{ unreadCount: number }>> {
    return this.api.get<{ unreadCount: number }>('/chat/unread-count');
  }
}
