import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/chat.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  isConnected = signal<boolean>(false);
  private messageSubject = new Subject<ChatMessage>();

  connect(): void {
    if (this.socket && this.socket.connected) return;

    const token = localStorage.getItem('access_token');
    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('[Socket.io] Connected to server socket channel');
      this.isConnected.set(true);
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from server');
      this.isConnected.set(false);
    });

    this.socket.on('receive_message', (msg: ChatMessage) => {
      this.messageSubject.next(msg);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.set(false);
    }
  }

  joinChatRoom(swapId: string): void {
    if (this.socket) {
      this.socket.emit('join_chat_room', { swapId });
    }
  }

  leaveChatRoom(swapId: string): void {
    if (this.socket) {
      this.socket.emit('leave_chat_room', { swapId });
    }
  }

  sendMessage(swapRequestId: string, message: string): void {
    if (this.socket) {
      this.socket.emit('send_message', { swapRequestId, message });
    }
  }

  onNewMessage(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      if (this.socket) {
        this.socket.on(eventName, (data: T) => subscriber.next(data));
      }
    });
  }
}
