import { ChatMessage, IChatMessage } from '../models/ChatMessage';

export class ChatRepository {
  async createMessage(data: Partial<IChatMessage>): Promise<IChatMessage> {
    const msg = new ChatMessage(data);
    await msg.save();
    return msg.populate([
      { path: 'sender', select: 'name avatarUrl' },
      { path: 'receiver', select: 'name avatarUrl' },
    ]);
  }

  async findBySwapId(swapRequestId: string, limit: number = 100): Promise<IChatMessage[]> {
    return ChatMessage.find({ swapRequest: swapRequestId })
      .populate('sender', 'name avatarUrl')
      .populate('receiver', 'name avatarUrl')
      .sort({ createdAt: 1 })
      .limit(limit);
  }

  async markAsRead(swapRequestId: string, receiverId: string): Promise<void> {
    await ChatMessage.updateMany(
      { swapRequest: swapRequestId, receiver: receiverId, read: false },
      { read: true }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return ChatMessage.countDocuments({ receiver: userId, read: false });
  }
}

export const chatRepository = new ChatRepository();
