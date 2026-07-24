import { User } from './user.model';

export interface Review {
  _id: string;
  swapRequest: string;
  reviewer: User;
  reviewee: User;
  rating: number;
  comment: string;
  createdAt: string;
}
