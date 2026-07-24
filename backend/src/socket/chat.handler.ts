import { Server, Socket } from 'socket.io';
import { chatService } from '../services/chat.service';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('join_chat_room', (data: { swapId: string }) => {
    socket.join(`swap_${data.swapId}`);
    console.log(`[Socket] Client ${socket.id} joined room swap_${data.swapId}`);
  });

  socket.on('leave_chat_room', (data: { swapId: string }) => {
    socket.leave(`swap_${data.swapId}`);
  });

  socket.on('send_message', async (data: { swapRequestId: string; message: string }) => {
    try {
      const userId = (socket as any).user?.userId;
      if (!userId) return;

      const savedMessage = await chatService.sendMessage(userId, data.swapRequestId, data.message);

      // Emit to room
      io.to(`swap_${data.swapRequestId}`).emit('receive_message', savedMessage);
    } catch (err: any) {
      socket.emit('error_message', { message: err.message || 'Failed to send socket message' });
    }
  });

  socket.on('typing', (data: { swapId: string; isTyping: boolean }) => {
    const userId = (socket as any).user?.userId;
    socket.to(`swap_${data.swapId}`).emit('user_typing', { userId, isTyping: data.isTyping });
  });
};
