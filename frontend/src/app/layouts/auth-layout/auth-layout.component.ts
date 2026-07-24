import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      
      <!-- Full-Screen Cinematic Aurora Mesh Gradient & Glowing Colorful Orbs -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pointer-events-none"></div>

      <!-- Glowing Color Orbs (Emerald, Royal Blue, Purple, Rose, Amber) -->
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[140px] animate-orb-pulse pointer-events-none"></div>
      <div class="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] animate-mesh-slow pointer-events-none"></div>
      <div class="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[150px] animate-orb-pulse pointer-events-none"></div>
      <div class="absolute top-2/3 -left-20 w-[400px] h-[400px] bg-rose-500/15 rounded-full blur-[130px] animate-mesh-slow pointer-events-none"></div>
      <div class="absolute top-10 right-1/4 w-[350px] h-[350px] bg-amber-500/15 rounded-full blur-[120px] animate-orb-pulse pointer-events-none"></div>

      <!-- Subtle Grid Mesh Pattern Overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none"></div>

      <!-- Top Minimal Header Logo Navigation -->
      <header class="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <a routerLink="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            R
          </div>
          <span class="text-xl font-black tracking-tight text-white">ReWear</span>
        </a>
        <a routerLink="/" class="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center space-x-1">
          <span>Back to Marketplace</span>
          <span>→</span>
        </a>
      </header>

      <!-- Main Widescreen Content Container -->
      <main class="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        <div class="w-full">
          <router-outlet />
        </div>
      </main>

      <app-toast />
    </div>
  `,
})
export class AuthLayoutComponent {}
