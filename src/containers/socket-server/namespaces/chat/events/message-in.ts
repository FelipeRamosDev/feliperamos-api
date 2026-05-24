import { NamespaceEvent } from '../../../../../services/SocketServer';
import ErrorSocketServer from '../../../../../services/SocketServer/ErrorSocketServer';

const userMessageEvent: NamespaceEvent = {
   name: 'message-in',
   handler(_, data, callback) {
      const { roomId, message, agentId, forwardEnd } = Object(data);
      const room = this.getRoom(roomId);

      if (!room) {
         callback?.(new ErrorSocketServer(`Room with ID ${roomId} not found.`, 'SOCKET_SERVER_ROOM_NOT_FOUND'));
         return;
      }

      global.socket.sendTo('/ai-core/common/chat-message', { chatId: roomId, stream: true, message, agentId, forwardEnd }, (response: any) => {
         if (response.error) {
            console.error(`Error sending user message to AI core for room ${roomId}:`, response.error);
            callback?.(new ErrorSocketServer(`Failed to send user message to AI core.`, 'AI_CORE_MESSAGE_FAILED'));
            return;
         }
      });

      callback?.({
         success: true,
         message: `Message received!`
      });
   }
};

export default userMessageEvent;
