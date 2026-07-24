import { Schema, model, Document, Types } from 'mongoose';

export type ItemCategory = 'Tops' | 'Bottoms' | 'Pants' | 'Outerwear' | 'Dresses' | 'Shoes' | 'Accessories' | 'Vintage';
export type ItemCondition = 'New with Tags' | 'Like New' | 'Good' | 'Fair';
export type ItemStatus = 'AVAILABLE' | 'SWAP_PENDING' | 'SWAPPED' | 'ARCHIVED';

export interface IItem extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: ItemCategory;
  size: string;
  brand: string;
  condition: ItemCondition;
  gender: 'Women' | 'Men' | 'Unisex' | 'Kids';
  valueEstimate: number;
  tags: string[];
  images: string[];
  owner: Types.ObjectId;
  swapPreference?: string;
  status: ItemStatus;
  likesCount: number;
  likedBy: Types.ObjectId[];
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Tops', 'Bottoms', 'Pants', 'Outerwear', 'Dresses', 'Shoes', 'Accessories', 'Vintage'],
    },
    size: { type: String, required: true },
    brand: { type: String, required: true, default: 'Unbranded' },
    condition: {
      type: String,
      required: true,
      enum: ['New with Tags', 'Like New', 'Good', 'Fair'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['Women', 'Men', 'Unisex', 'Kids'],
      default: 'Unisex',
    },
    valueEstimate: { type: Number, required: true, default: 50 },
    tags: [{ type: String }],
    images: [{ type: String, required: true }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    swapPreference: { type: String, default: 'Open to all offers, preferably vintage tops or jackets' },
    status: {
      type: String,
      enum: ['AVAILABLE', 'SWAP_PENDING', 'SWAPPED', 'ARCHIVED'],
      default: 'AVAILABLE',
    },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

export const Item = model<IItem>('Item', itemSchema);
