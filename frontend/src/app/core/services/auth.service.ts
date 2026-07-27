import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  currentUser = signal<User | null>(this.getStoredUser());
  accessToken = signal<string | null>(this.getStoredToken());

  isAuthenticated = computed(() => !!this.currentUser() && !!this.accessToken());
  userRole = computed(() => this.currentUser()?.role || 'USER');
  isAdmin = computed(() => this.userRole() === 'ADMIN' || this.userRole() === 'MODERATOR');

  private getStorage(rememberMe: boolean = true): Storage {
    return rememberMe ? localStorage : sessionStorage;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false;
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return null;
    if (this.isTokenExpired(token)) {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      return null;
    }
    return token;
  }

  register(data: any): Observable<ApiResponse<{ user: User; accessToken: string }>> {
    return this.api.post<{ user: User; accessToken: string }>('/auth/register', data).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data.user, res.data.accessToken, true);
        }
      })
    );
  }

  login(credentials: any, rememberMe: boolean = true): Observable<ApiResponse<{ user: User; accessToken: string }>> {
    return this.api.post<{ user: User; accessToken: string }>('/auth/login', credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data.user, res.data.accessToken, rememberMe);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<{ accessToken: string }>> {
    return this.api.post<{ accessToken: string }>('/auth/refresh', {}).pipe(
      tap((res) => {
        if (res.success && res.data?.accessToken) {
          this.accessToken.set(res.data.accessToken);
          if (localStorage.getItem('access_token')) {
            localStorage.setItem('access_token', res.data.accessToken);
          } else {
            sessionStorage.setItem('access_token', res.data.accessToken);
          }
        }
      })
    );
  }

  logout(): void {
    // 1. Instantly clear session state and signals
    this.clearSession();

    // 2. Clear all local storage & session storage items (drafts, cached data, tokens)
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}

    // 3. Fire silent API logout request to invalidate session on server
    this.api.post('/auth/logout', {}).subscribe({
      error: () => {},
    });

    // 4. Notify user
    this.notification.info('Signed Out', 'You have been signed out successfully.');

    // 5. Instantly redirect to Landing Page ('/') replacing history so Back button cannot return to protected pages
    this.router.navigate(['/'], { replaceUrl: true }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  private setSession(user: User, token: string, rememberMe: boolean): void {
    this.currentUser.set(user);
    this.accessToken.set(token);

    const storage = this.getStorage(rememberMe);
    storage.setItem('user_data', JSON.stringify(user));
    storage.setItem('access_token', token);
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);
    if (localStorage.getItem('user_data')) {
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }
  }
}
