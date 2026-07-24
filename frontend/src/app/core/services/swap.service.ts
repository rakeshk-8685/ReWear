import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SwapRequest, SwapStatus } from '../models/swap.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class SwapService {
  private api = inject(ApiService);

  createSwapProposal(data: { requestedItemId: string; offeredItemIds: string[]; message?: string }): Observable<ApiResponse<SwapRequest>> {
    return this.api.post<SwapRequest>('/swaps', data);
  }

  getMySwaps(): Observable<ApiResponse<SwapRequest[]>> {
    return this.api.get<SwapRequest[]>('/swaps/my-swaps');
  }

  getSwapById(id: string): Observable<ApiResponse<SwapRequest>> {
    return this.api.get<SwapRequest>(`/swaps/${id}`);
  }

  updateSwapStatus(id: string, status: SwapStatus): Observable<ApiResponse<SwapRequest>> {
    return this.api.patch<SwapRequest>(`/swaps/${id}/status`, { status });
  }

  updateShippingInfo(id: string, data: { carrier: string; trackingNumber: string }): Observable<ApiResponse<SwapRequest>> {
    return this.api.patch<SwapRequest>(`/swaps/${id}/shipping`, data);
  }
}
