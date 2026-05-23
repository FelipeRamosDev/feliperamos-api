import { startChatMiddleware } from '../../../middlewares/startChat';
import { NamespaceEvent } from '../../../../../services/SocketServer';

const startBuildEvent: NamespaceEvent = {
   name: 'start-build',
   middlewares: [
      startChatMiddleware
   ],
   handler(_, data, callback) {
      callback({
         success: true,
         roomId: data.roomId,
         chatId: data.chatId,
         message: 'Build created and joined successfully.'
      });
   }
};

export default startBuildEvent;
