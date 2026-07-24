import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themeMode = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const mode = this.themeMode();
      localStorage.setItem('rewear_theme', mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  private getInitialTheme(): ThemeMode {
    const stored = localStorage.getItem('rewear_theme') as ThemeMode;
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme(): void {
    this.themeMode.set(this.themeMode() === 'dark' ? 'light' : 'dark');
  }
}
