export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: [number, number];
  };
  preferredSizes?: string[];
  preferredCategories?: string[];
  swapCount: number;
  ratingAverage: number;
  ratingCount: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
