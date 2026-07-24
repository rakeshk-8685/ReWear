import { User } from './user.model';

export type ItemCategory = 'Tops' | 'Bottoms' | 'Outerwear' | 'Dresses' | 'Shoes' | 'Accessories' | 'Vintage' | 'Pants';
export type ItemCondition = 'New with Tags' | 'Like New' | 'Good' | 'Fair' | 'Excellent';
export type ItemStatus = 'AVAILABLE' | 'SWAP_PENDING' | 'SWAPPED' | 'ARCHIVED';
export type GenderCategory = 'Women' | 'Men' | 'Unisex' | 'Kids';

export interface Item {
  _id: string;
  title: string;
  description: string;
  category: ItemCategory;
  size: string;
  brand: string;
  condition: ItemCondition;
  gender: GenderCategory;
  valueEstimate: number;
  tags: string[];
  images: string[];
  owner: User | any;
  material?: string;
  color?: string;
  location?: string;
  swapPreference?: string;
  status: ItemStatus;
  likesCount: number;
  likedBy?: string[];
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemFilterParams {
  search?: string;
  category?: string;
  condition?: string;
  gender?: string;
  size?: string;
  brand?: string;
  minValue?: number;
  maxValue?: number;
  status?: string;
  ownerId?: string;
  excludeOwnerId?: string;
  page?: number;
  limit?: number;
}
