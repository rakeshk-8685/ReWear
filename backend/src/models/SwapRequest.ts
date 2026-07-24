import { Schema, model, Document, Types } from 'mongoose';

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface ISwapRequest extends Document {
  _id: Types.ObjectId;
  requester: Types.ObjectId;
  receiver: Types.ObjectId;
  requestedItem: Types.ObjectId;
  offeredItems: Types.ObjectId[];
  status: SwapStatus;
  message?: string;
  shippingInfo?: {
    requesterTrackingNumber?: string;
    requesterCarrier?: string;
    requesterShippedAt?: Date;
    receiverTrackingNumber?: string;
    receiverCarrier?: string;
    receiverShippedAt?: Date;
  };
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedItem: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    offeredItems: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
    message: { type: String, default: 'Hey! I would love to trade items with you.' },
    shippingInfo: {
      requesterTrackingNumber: String,
      requesterCarrier: String,
      requesterShippedAt: Date,
      receiverTrackingNumber: String,
      receiverCarrier: String,
      receiverShippedAt: Date,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

export const SwapRequest = model<ISwapRequest>('SwapRequest', swapRequestSchema);
