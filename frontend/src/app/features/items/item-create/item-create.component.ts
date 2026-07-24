import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Item } from '../../../core/models/item.model';

@Component({
  selector: 'app-item-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      
      <!-- Top Title Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ isEditMode() ? 'Edit Clothing Listing' : 'List Clothing Garment' }}
          </h1>
          <p class="text-sm text-slate-500">
            {{ isEditMode() ? 'Update garment specs and swap preferences' : 'Upload photos and details to swap pre-loved apparel' }}
          </p>
        </div>
        <a routerLink="/items" class="text-xs font-bold text-slate-400 hover:text-slate-600">Back to Marketplace</a>
      </div>

      <!-- Restored Draft Banner -->
      @if (hasSavedDraft() && !isEditMode()) {
        <div class="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div class="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-300">
            <span>📝</span>
            <span>You have an unsaved draft from a previous session.</span>
          </div>
          <div class="flex items-center space-x-2">
            <button (click)="restoreDraft()" class="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-sm">
              Restore Draft
            </button>
            <button (click)="clearDraft()" class="px-3 py-1 rounded-full text-slate-400 font-bold text-xs">
              Discard
            </button>
          </div>
        </div>
      }

      <form [formGroup]="itemForm" (ngSubmit)="onSubmit('AVAILABLE')" class="space-y-8">
        
        <!-- Section 1: Drag & Drop Multi-Image Upload Dropzone -->
        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Garment Photos (Up to 5)</h3>
            <p class="text-xs text-slate-400">Drag & drop high-resolution photos. First image will be the primary cover photo.</p>
          </div>

          <div
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [class]="isDragging() ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'"
            class="p-8 border-2 border-dashed rounded-3xl text-center space-y-3 transition-all cursor-pointer relative"
          >
            <input
              id="itemPhotos"
              name="photos"
              type="file"
              multiple
              accept="image/*"
              (change)="onFileSelected($event)"
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
              📸
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click or drag & drop photos here
              </p>
              <p class="text-xs text-slate-400">Supports PNG, JPG, WEBP up to 5MB each</p>
            </div>
          </div>

          <!-- Image Previews Thumbnails Grid -->
          @if (images().length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              @for (img of images(); track img; let idx = $index) {
                <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 group border border-slate-700">
                  <img [src]="img" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    (click)="removeImage(idx)"
                    class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center opacity-90 hover:opacity-100 shadow-md"
                  >
                    ×
                  </button>
                  @if (idx === 0) {
                    <span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-extrabold text-[9px] uppercase">
                      Cover
                    </span>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Section 2: Core Garment Specifications Matrix -->
        <div class="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Garment Details</h3>

          <div>
            <label for="itemTitle" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Title / Garment Name</label>
            <input
              id="itemTitle"
              name="title"
              type="text"
              formControlName="title"
              placeholder="e.g. Vintage 90s Distressed Leather Biker Jacket"
              class="w-full px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="itemCategory" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
              <select
                id="itemCategory"
                name="category"
                formControlName="category"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              >
                <option value="Vintage">Vintage</option>
                <option value="Tops">Tops & Shirts</option>
                <option value="Outerwear">Outerwear & Jackets</option>
                <option value="Dresses">Dresses & Skirts</option>
                <option value="Pants">Pants & Jeans</option>
                <option value="Shoes">Shoes & Boots</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label for="itemBrand" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Brand</label>
              <input
                id="itemBrand"
                name="brand"
                type="text"
                formControlName="brand"
                placeholder="e.g. Levi's, Patagonia, Nike, Reformation"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label for="itemCondition" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Condition</label>
              <select
                id="itemCondition"
                name="condition"
                formControlName="condition"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              >
                <option value="New with Tags">New With Tags</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good Condition</option>
                <option value="Fair">Fair / Vintage Distressed</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label for="itemSize" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Size</label>
              <input
                id="itemSize"
                name="size"
                type="text"
                formControlName="size"
                placeholder="e.g. M, L, 32/30"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label for="itemGender" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Gender Fit</label>
              <select
                id="itemGender"
                name="gender"
                formControlName="gender"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              >
                <option value="Unisex">Unisex</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
              </select>
            </div>

            <div>
              <label for="itemMaterial" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Material</label>
              <input
                id="itemMaterial"
                name="material"
                type="text"
                formControlName="material"
                placeholder="e.g. 100% Genuine Leather"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label for="itemValueEstimate" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Est. Swap Value ($)</label>
              <input
                id="itemValueEstimate"
                name="valueEstimate"
                type="number"
                formControlName="valueEstimate"
                placeholder="120"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold text-emerald-500"
              />
            </div>
          </div>

          <div>
            <label for="itemDescription" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
            <textarea
              id="itemDescription"
              name="description"
              formControlName="description"
              rows="4"
              placeholder="Describe garment condition, fabric texture, measurements, fit, and any unique design details..."
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
            ></textarea>
          </div>

          <div>
            <label for="itemSwapPreference" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Swap Wishlist Preference</label>
            <input
              id="itemSwapPreference"
              name="swapPreference"
              type="text"
              formControlName="swapPreference"
              placeholder="e.g. Open to all offers, preferably vintage denim or oversized fleece jackets"
              class="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        <!-- Submit Footer Buttons -->
        <div class="flex items-center justify-end space-x-4">
          <button
            type="button"
            (click)="onSubmit('DRAFT')"
            [disabled]="isLoading()"
            class="px-6 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-300 transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            @if (isLoading()) {
              <span>Publishing Item...</span>
            } @else {
              <span>{{ isEditMode() ? 'Update Listing' : 'Publish Garment' }}</span>
            }
          </button>
        </div>

      </form>
    </div>
  `,
})
export class ItemCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  isDragging = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editId = signal<string | null>(null);
  images = signal<string[]>([]);
  hasSavedDraft = signal<boolean>(false);

  itemForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['Vintage', [Validators.required]],
    brand: ['', [Validators.required]],
    condition: ['Like New', [Validators.required]],
    size: ['M', [Validators.required]],
    gender: ['Unisex', [Validators.required]],
    material: ['100% Genuine Leather'],
    valueEstimate: [120, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    swapPreference: [''],
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = params['editId'];
      if (id) {
        this.isEditMode.set(true);
        this.editId.set(id);
        this.fetchExistingItem(id);
      } else {
        this.checkSavedDraft();
      }
    });

    this.itemForm.valueChanges.subscribe(() => {
      if (!this.isEditMode()) {
        localStorage.setItem('rewear_item_draft', JSON.stringify({
          form: this.itemForm.value,
          images: this.images(),
        }));
      }
    });
  }

  private checkSavedDraft(): void {
    const raw = localStorage.getItem('rewear_item_draft');
    if (raw) {
      this.hasSavedDraft.set(true);
    }
  }

  restoreDraft(): void {
    const raw = localStorage.getItem('rewear_item_draft');
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        if (draft.form) this.itemForm.patchValue(draft.form);
        if (draft.images) this.images.set(draft.images);
        this.notification.success('Draft Restored', 'Unsaved garment draft restored.');
      } catch {}
    }
  }

  clearDraft(): void {
    localStorage.removeItem('rewear_item_draft');
    this.hasSavedDraft.set(false);
  }

  private fetchExistingItem(id: string): void {
    this.itemService.getItemById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const item = res.data;
          this.itemForm.patchValue({
            title: item.title,
            category: item.category,
            brand: item.brand,
            condition: item.condition,
            size: item.size,
            gender: item.gender,
            valueEstimate: item.valueEstimate,
            description: item.description,
            swapPreference: item.swapPreference || '',
          });
          if (item.images) this.images.set(item.images);
        }
      },
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]): void {
    const current = [...this.images()];
    files.forEach((file) => {
      if (current.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          current.push(e.target.result as string);
          this.images.set([...current]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    const current = [...this.images()];
    current.splice(index, 1);
    this.images.set(current);
  }

  onSubmit(status: 'AVAILABLE' | 'DRAFT'): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.notification.warning('Incomplete Form', 'Please fill in all required garment details before publishing.');
      return;
    }

    if (this.images().length === 0) {
      this.images.set(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800']);
      this.notification.info('Sample Photo Added', 'Added a preview photo for your garment listing.');
    }

    this.isLoading.set(true);
    const formVal = this.itemForm.value;

    const payload = {
      ...formVal,
      images: this.images(),
      status,
    };

    if (this.isEditMode() && this.editId()) {
      this.itemService.updateItem(this.editId()!, payload).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.clearDraft();
          this.notification.success('Listing Updated', 'Garment details updated successfully.');
          this.router.navigate(['/items', this.editId()!]);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notification.error('Update Failed', err?.error?.message || 'Could not update listing. Please try again.');
        },
      });
    } else {
      this.itemService.createItem(payload).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.clearDraft();
          this.notification.success('Listing Published', 'Garment added to marketplace feed.');
          this.router.navigate(['/items']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notification.error('Publishing Failed', err?.error?.message || 'Could not publish garment listing. Please try again.');
        },
      });
    }
  }
}
