import { chatRepository } from '../repositories/chat.repository';
import { swapRepository } from '../repositories/swap.repository';
import { ApiError } from '../utils/api-error';

export class ChatService {
  async sendMessage(senderId: string, swapRequestId: string, messageText: string) {
    const swap = await swapRepository.findById(swapRequestId);
    if (!swap) {
      throw ApiError.notFound('Associated swap request not found.');
    }

    const requesterId = swap.requester._id.toString();
    const receiverId = swap.receiver._id.toString();

    if (senderId !== requesterId && senderId !== receiverId) {
      throw ApiError.forbidden('You are not a participant in this swap chat.');
    }

    const recipientId = senderId === requesterId ? receiverId : requesterId;

    return chatRepository.createMessage({
      swapRequest: swapRequestId as any,
      sender: senderId as any,
      receiver: recipientId as any,
      message: messageText,
    });
  }

  async getSwapMessages(swapRequestId: string, userId: string) {
    const swap = await swapRepository.findById(swapRequestId);
    if (!swap) {
      throw ApiError.notFound('Swap request not found.');
    }

    const requesterId = swap.requester._id.toString();
    const receiverId = swap.receiver._id.toString();

    if (userId !== requesterId && userId !== receiverId) {
      throw ApiError.forbidden('Access denied to conversation.');
    }

    await chatRepository.markAsRead(swapRequestId, userId);
    return chatRepository.findBySwapId(swapRequestId);
  }

  async getUnreadCount(userId: string) {
    return chatRepository.getUnreadCount(userId);
  }
}

export const chatService = new ChatService();
