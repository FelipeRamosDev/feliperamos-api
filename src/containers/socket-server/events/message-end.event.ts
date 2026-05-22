import { EventEndpoint } from '../../../services';
import ErrorEventEndpoint from '../../../services/EventEndpoint/ErrorEventEndpoint';

export default new EventEndpoint({
   path: '/socket-server/message-end',
   async controller(data, done) {
      const { roomId, finalOutput } = Object(data);
      const room = global.socket.getNamespace('/chat')?.getRoom(roomId);
      const clientId = roomId?.replace('chat_', '');

      if (!room) {
         return done?.(new ErrorEventEndpoint(`Room with ID ${roomId} not found.`, 'SOCKET_SERVER_ROOM_NOT_FOUND'));
      }

      if (!clientId) {
         return done?.(new ErrorEventEndpoint(`Invalid room ID ${roomId}.`, 'SOCKET_SERVER_INVALID_ROOM_ID'));
      }

      try {
         room.sendToClient(clientId, 'message_end', { finalOutput });
         done?.({ success: true });
      } catch (error: any) {
         done?.(new ErrorEventEndpoint(`Failed to forward message chunk: ${error.message}`, 'SOCKET_SERVER_MESSAGE_CHUNK_FAILED'));
      }
   }
});
