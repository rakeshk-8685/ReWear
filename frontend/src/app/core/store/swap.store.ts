import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { SwapRequest } from '../models/swap.model';
import { SwapService } from '../services/swap.service';

export interface SwapState {
  swaps: SwapRequest[];
  selectedSwap: SwapRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: SwapState = {
  swaps: [],
  selectedSwap: null,
  loading: false,
  error: null,
};

export const SwapStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    pendingSwaps: computed(() => state.swaps().filter((s: SwapRequest) => s.status === 'PENDING')),
    activeSwaps: computed(() => state.swaps().filter((s: SwapRequest) => s.status === 'ACCEPTED')),
    completedSwaps: computed(() => state.swaps().filter((s: SwapRequest) => s.status === 'COMPLETED')),
  })),
  withMethods((store, swapService = inject(SwapService)) => ({
    loadSwaps() {
      patchState(store, { loading: true });
      swapService.getMySwaps().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            patchState(store, { swaps: res.data, loading: false });
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
