import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app: FirebaseApp;
  analytics: Analytics | null = null;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.initAnalytics();
  }

  private async initAnalytics(): Promise<void> {
    try {
      if (await isSupported()) {
        this.analytics = getAnalytics(this.app);
        console.log('[Firebase] Analytics initialized successfully for rewear-8a08c');
      }
    } catch (err) {
      console.warn('[Firebase] Analytics initialization warning:', err);
    }
  }
}
