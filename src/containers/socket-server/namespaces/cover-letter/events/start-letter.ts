import { startChatMiddleware } from '../../../../../containers/socket-server/middlewares/startChat';
import { NamespaceEvent } from '../../../../../services/SocketServer';

const startLetter: NamespaceEvent = {
   name: 'start-letter',
   middlewares: [
      startChatMiddleware
   ],
   handler(_, data, callback) {
      callback({
         success: true,
         roomId: data.roomId,
         chatId: data.chatId,
         message: 'Letter started and joined successfully.'
      });
   }
};

export default startLetter;

