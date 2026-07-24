import { User } from './user.model';
import { Item } from './item.model';

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface ShippingInfo {
  requesterTrackingNumber?: string;
  requesterCarrier?: string;
  requesterShippedAt?: string;
  receiverTrackingNumber?: string;
  receiverCarrier?: string;
  receiverShippedAt?: string;
}

export interface SwapRequest {
  _id: string;
  requester: User;
  receiver: User;
  requestedItem: Item;
  offeredItems: Item[];
  status: SwapStatus;
  message?: string;
  shippingInfo?: ShippingInfo;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
