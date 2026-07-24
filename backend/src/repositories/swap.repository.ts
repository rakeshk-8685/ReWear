import { SwapRequest, ISwapRequest } from '../models/SwapRequest';

export class SwapRepository {
  async findById(id: string): Promise<ISwapRequest | null> {
    return SwapRequest.findById(id)
      .populate('requester', 'name avatarUrl ratingAverage ratingCount email')
      .populate('receiver', 'name avatarUrl ratingAverage ratingCount email')
      .populate('requestedItem')
      .populate('offeredItems');
  }

  async countAll(): Promise<number> {
    return SwapRequest.countDocuments();
  }

  async create(swapData: Partial<ISwapRequest>): Promise<ISwapRequest> {
    const swap = new SwapRequest(swapData);
    return swap.save();
  }

  async updateStatus(id: string, status: string): Promise<ISwapRequest | null> {
    const updatePayload: any = { status };
    if (status === 'COMPLETED') {
      updatePayload.completedAt = new Date();
    }
    return SwapRequest.findByIdAndUpdate(id, updatePayload, { new: true })
      .populate('requester', 'name avatarUrl ratingAverage ratingCount email')
      .populate('receiver', 'name avatarUrl ratingAverage ratingCount email')
      .populate('requestedItem')
      .populate('offeredItems');
  }

  async updateShippingInfo(id: string, shippingInfo: any): Promise<ISwapRequest | null> {
    return SwapRequest.findByIdAndUpdate(
      id,
      { $set: { shippingInfo } },
      { new: true }
    )
      .populate('requester', 'name avatarUrl ratingAverage ratingCount email')
      .populate('receiver', 'name avatarUrl ratingAverage ratingCount email')
      .populate('requestedItem')
      .populate('offeredItems');
  }

  async findUserSwaps(userId: string): Promise<ISwapRequest[]> {
    return SwapRequest.find({
      $or: [{ requester: userId }, { receiver: userId }],
    })
      .populate('requester', 'name avatarUrl ratingAverage ratingCount')
      .populate('receiver', 'name avatarUrl ratingAverage ratingCount')
      .populate('requestedItem')
      .populate('offeredItems')
      .sort({ createdAt: -1 });
  }

  async findExistingPending(requesterId: string, requestedItemId: string): Promise<ISwapRequest | null> {
    return SwapRequest.findOne({
      requester: requesterId,
      requestedItem: requestedItemId,
      status: { $in: ['PENDING', 'ACCEPTED'] },
    });
  }
}

export const swapRepository = new SwapRepository();
