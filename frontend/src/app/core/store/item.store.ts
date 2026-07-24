import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Item, ItemFilterParams } from '../models/item.model';
import { ItemService } from '../services/item.service';

export interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  filters: ItemFilterParams;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  filters: { page: 1, limit: 12 },
  total: 0,
  loading: false,
  error: null,
};

export const ItemStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    availableItems: computed(() => state.items().filter((i: Item) => i.status === 'AVAILABLE')),
    hasItems: computed(() => state.items().length > 0),
  })),
  withMethods((store, itemService = inject(ItemService)) => ({
    setFilters(params: Partial<ItemFilterParams>) {
      patchState(store, (state) => ({ filters: { ...state.filters, ...params } }));
    },
    fetchItems(params?: ItemFilterParams) {
      patchState(store, { loading: true });
      itemService.getItems(params).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            patchState(store, {
              items: res.data,
              total: res.meta?.total ?? res.data.length,
              loading: false,
            });
          } else {
            patchState(store, { loading: false });
          }
        },
        error: (err) => {
          patchState(store, { loading: false, error: err.message });
        },
      });
    },
  }))
);
