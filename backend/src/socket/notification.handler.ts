import { Server, Socket } from 'socket.io';

export const registerNotificationHandlers = (io: Server, socket: Socket) => {
  const userId = (socket as any).user?.userId;
  if (userId) {
    socket.join(`user_${userId}`);
    console.log(`[Socket] User ${userId} registered for personal notifications`);
  }

  socket.on('register_user', (data: { userId: string }) => {
    socket.join(`user_${data.userId}`);
  });
};

export const sendRealtimeNotification = (io: Server, recipientId: string, payload: any) => {
  io.to(`user_${recipientId}`).emit('new_notification', payload);
};
