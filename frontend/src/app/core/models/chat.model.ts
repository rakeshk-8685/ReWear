import { User } from './user.model';

export interface ChatMessage {
  _id: string;
  swapRequest?: string;
  swapRequestId?: string;
  sender: User | string;
  receiver: User | string;
  message: string;
  imageUrl?: string;
  location?: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}
