import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { DynamicIslandComponent } from '../../shared/components/dynamic-island/dynamic-island.component';
import { QuickPreviewModalComponent } from '../../shared/components/quick-preview-modal/quick-preview-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    DynamicIslandComponent,
    QuickPreviewModalComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      <!-- Apple Dynamic Island Floating Activity Widget -->
      <app-dynamic-island />

      <app-navbar />

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 pb-24 md:pb-8 overflow-x-hidden">
        <router-outlet />
      </main>

      <app-footer />
      <app-toast />

      <!-- Global Quick Preview Garment Modal -->
      <app-quick-preview-modal />
    </div>
  `,
})
export class MainLayoutComponent {}
