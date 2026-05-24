import { NamespaceConfig } from '../../../../services/SocketServer'
import startChatEvent from './events/start-chat';
import messageInEvent from './events/message-in';

const startChatNS: NamespaceConfig = {
   name: 'Chat',
   path: '/chat',
   events: [ startChatEvent, messageInEvent ],
   connectionHandler: (socket) => {
      console.log(`Client connected to Chat namespace: ${socket.id}`);
   },
}

export default startChatNS;
