import { startChatMiddleware } from '../../../middlewares/startChat';
import { NamespaceEvent } from '../../../../../services/SocketServer';

const startChatEvent: NamespaceEvent = {
   name: 'start-chat',
   middlewares: [
      startChatMiddleware
   ],
   handler(_, data, callback) {
      callback({
         success: true,
         roomId: data.roomId,
         chatId: data.chatId,
         message: 'Chat created and joined successfully.'
      });
   }
};

export default startChatEvent;
