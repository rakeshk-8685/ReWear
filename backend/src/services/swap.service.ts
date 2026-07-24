import { swapRepository } from '../repositories/swap.repository';
import { itemRepository } from '../repositories/item.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/api-error';

export class SwapService {
  async createSwapProposal(requesterId: string, requestedItemId: string, offeredItemIds: string[], message?: string) {
    const requestedItem = await itemRepository.findById(requestedItemId);
    if (!requestedItem) {
      throw ApiError.notFound('Target item requested for swap does not exist.');
    }

    if (requestedItem.status !== 'AVAILABLE') {
      throw ApiError.badRequest('This item is currently not available for swapping.');
    }

    const receiverId = requestedItem.owner._id.toString();
    if (receiverId === requesterId) {
      throw ApiError.badRequest('You cannot propose a swap for your own clothing item.');
    }

    const existing = await swapRepository.findExistingPending(requesterId, requestedItemId);
    if (existing) {
      throw ApiError.conflict('You already have an active pending swap proposal for this item.');
    }

    // Verify offered items belong to requester and are AVAILABLE
    for (const offeredId of offeredItemIds) {
      const offeredItem = await itemRepository.findById(offeredId);
      if (!offeredItem || offeredItem.owner._id.toString() !== requesterId) {
        throw ApiError.badRequest(`Offered item with ID ${offeredId} does not belong to your closet.`);
      }
      if (offeredItem.status !== 'AVAILABLE') {
        throw ApiError.badRequest(`Offered item "${offeredItem.title}" is not available.`);
      }
    }

    const swap = await swapRepository.create({
      requester: requesterId as any,
      receiver: receiverId as any,
      requestedItem: requestedItemId as any,
      offeredItems: offeredItemIds as any[],
      message,
      status: 'PENDING',
    });

    return swapRepository.findById(swap._id.toString());
  }

  async getUserSwaps(userId: string) {
    return swapRepository.findUserSwaps(userId);
  }

  async getSwapById(swapId: string, userId: string) {
    const swap = await swapRepository.findById(swapId);
    if (!swap) {
      throw ApiError.notFound('Swap request not found.');
    }

    const isParticipant =
      swap.requester._id.toString() === userId || swap.receiver._id.toString() === userId;

    if (!isParticipant) {
      throw ApiError.forbidden('You are not a participant in this swap request.');
    }

    return swap;
  }

  async updateSwapStatus(swapId: string, userId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED') {
    const swap = await swapRepository.findById(swapId);
    if (!swap) {
      throw ApiError.notFound('Swap request not found.');
    }

    const requesterId = swap.requester._id.toString();
    const receiverId = swap.receiver._id.toString();

    if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
      if (receiverId !== userId) {
        throw ApiError.forbidden('Only the recipient of the swap proposal can accept or reject it.');
      }
    }

    if (newStatus === 'CANCELLED') {
      if (requesterId !== userId) {
        throw ApiError.forbidden('Only the creator of the swap proposal can cancel it.');
      }
    }

    if (newStatus === 'ACCEPTED') {
      // Reserve items
      const allItemIds = [swap.requestedItem._id.toString(), ...swap.offeredItems.map((i: any) => i._id.toString())];
      await itemRepository.updateStatusMany(allItemIds, 'SWAP_PENDING');
    } else if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
      // Re-open items if they were pending
      const allItemIds = [swap.requestedItem._id.toString(), ...swap.offeredItems.map((i: any) => i._id.toString())];
      await itemRepository.updateStatusMany(allItemIds, 'AVAILABLE');
    } else if (newStatus === 'COMPLETED') {
      // Lock items as SWAPPED & Increment swapCount for both users
      const allItemIds = [swap.requestedItem._id.toString(), ...swap.offeredItems.map((i: any) => i._id.toString())];
      await itemRepository.updateStatusMany(allItemIds, 'SWAPPED');

      const requester = await userRepository.findById(requesterId);
      if (requester) {
        requester.swapCount += 1;
        await requester.save();
      }
      const receiver = await userRepository.findById(receiverId);
      if (receiver) {
        receiver.swapCount += 1;
        await receiver.save();
      }
    }

    return swapRepository.updateStatus(swapId, newStatus);
  }

  async updateShippingInfo(
    swapId: string,
    userId: string,
    shippingData: { carrier: string; trackingNumber: string }
  ) {
    const swap = await swapRepository.findById(swapId);
    if (!swap) {
      throw ApiError.notFound('Swap request not found.');
    }

    const isRequester = swap.requester._id.toString() === userId;
    const isReceiver = swap.receiver._id.toString() === userId;

    if (!isRequester && !isReceiver) {
      throw ApiError.forbidden('You are not authorized to update shipping information for this swap.');
    }

    const currentShipping = swap.shippingInfo || {};
    if (isRequester) {
      currentShipping.requesterCarrier = shippingData.carrier;
      currentShipping.requesterTrackingNumber = shippingData.trackingNumber;
      currentShipping.requesterShippedAt = new Date();
    } else {
      currentShipping.receiverCarrier = shippingData.carrier;
      currentShipping.receiverTrackingNumber = shippingData.trackingNumber;
      currentShipping.receiverShippedAt = new Date();
    }

    return swapRepository.updateShippingInfo(swapId, currentShipping);
  }
}

export const swapService = new SwapService();
