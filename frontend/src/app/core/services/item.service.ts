import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { Item, ItemFilterParams } from '../models/item.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export const DEFAULT_USER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
export const DEFAULT_ITEM_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';

export function normalizeItem(item: any): Item {
  let ownerObj: any = {
    _id: 'unknown',
    name: 'Verified Swapper',
    avatarUrl: DEFAULT_USER_AVATAR,
    ratingAverage: 5.0,
    ratingCount: 1,
    swapCount: 1,
  };

  if (item && item.owner && typeof item.owner === 'object') {
    ownerObj = {
      _id: item.owner._id || item.owner.id || 'unknown',
      name: item.owner.name || 'Verified Swapper',
      avatarUrl: item.owner.avatarUrl || DEFAULT_USER_AVATAR,
      ratingAverage: item.owner.ratingAverage ?? 5.0,
      ratingCount: item.owner.ratingCount ?? 1,
      swapCount: item.owner.swapCount ?? 1,
    };
  } else if (typeof item?.owner === 'string') {
    ownerObj._id = item.owner;
  }

  const imagesArr = Array.isArray(item?.images) && item.images.length > 0
    ? item.images.filter(Boolean)
    : [DEFAULT_ITEM_IMAGE];

  return {
    ...item,
    _id: item?._id || item?.id || 'item-id',
    title: item?.title || 'Clothing Garment',
    description: item?.description || 'Pre-loved apparel available for swap.',
    category: item?.category || 'Tops',
    size: item?.size || 'M',
    brand: item?.brand || 'Pre-Loved',
    condition: item?.condition || 'Like New',
    gender: item?.gender || 'Unisex',
    valueEstimate: item?.valueEstimate ?? 50,
    images: imagesArr.length > 0 ? imagesArr : [DEFAULT_ITEM_IMAGE],
    owner: ownerObj,
    status: item?.status || 'AVAILABLE',
    likesCount: item?.likesCount ?? 0,
    likedBy: Array.isArray(item?.likedBy) ? item.likedBy : [],
  };
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  getItems(params?: ItemFilterParams): Observable<ApiResponse<Item[]>> {
    return this.api.get<Item[]>('/items', params).pipe(
      map((res) => {
        if (res.data && Array.isArray(res.data)) {
          return {
            ...res,
            data: res.data.map(normalizeItem),
          };
        }
        return res;
      })
    );
  }

  getItemById(id: string): Observable<ApiResponse<Item>> {
    return this.api.get<Item>(`/items/${id}`).pipe(
      map((res) => {
        if (res.data) {
          return {
            ...res,
            data: normalizeItem(res.data),
          };
        }
        return res;
      })
    );
  }

  createItem(data: any): Observable<ApiResponse<Item>> {
    if (data instanceof FormData) {
      return this.http.post<ApiResponse<Item>>(`${environment.apiUrl}/items`, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      }).pipe(
        map((res) => {
          if (res.data) {
            return {
              ...res,
              data: normalizeItem(res.data),
            };
          }
          return res;
        })
      );
    }
    return this.api.post<Item>('/items', data).pipe(
      map((res) => {
        if (res.data) {
          return {
            ...res,
            data: normalizeItem(res.data),
          };
        }
        return res;
      })
    );
  }

  updateItem(id: string, data: any): Observable<ApiResponse<Item>> {
    return this.api.put<Item>(`/items/${id}`, data).pipe(
      map((res) => {
        if (res.data) {
          return {
            ...res,
            data: normalizeItem(res.data),
          };
        }
        return res;
      })
    );
  }

  deleteItem(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/items/${id}`);
  }

  toggleLike(id: string): Observable<ApiResponse<{ item: Item; liked: boolean }>> {
    return this.api.post<{ item: Item; liked: boolean }>(`/items/${id}/like`, {});
  }
}
