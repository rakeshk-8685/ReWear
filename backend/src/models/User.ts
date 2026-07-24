import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
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
  refreshToken?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'MODERATOR', 'ADMIN'], default: 'USER' },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
    bio: { type: String, default: 'Passionate about sustainable fashion and clothing swaps.' },
    location: {
      city: { type: String, default: 'San Francisco' },
      country: { type: String, default: 'USA' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    preferredSizes: [{ type: String }],
    preferredCategories: [{ type: String }],
    swapCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.passwordHash;
    delete ret.refreshToken;
    return ret;
  },
});

export const User = model<IUser>('User', userSchema);
