import { Injectable, signal } from '@angular/core';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class QuickPreviewService {
  readonly previewItem = signal<Item | null>(null);
  readonly isOpen = signal<boolean>(false);
  readonly selectedImageIndex = signal<number>(0);

  open(item: Item): void {
    this.previewItem.set(item);
    this.selectedImageIndex.set(0);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.previewItem.set(null);
    this.selectedImageIndex.set(0);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }
}
