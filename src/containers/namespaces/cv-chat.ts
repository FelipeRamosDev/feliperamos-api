import { NamespaceConfig } from '@/services/SocketServer';
import startChatEvent from './events/start-chat';
import assitantInboxEvent from './events/assistant-inbox';

const cvChatNamespace: NamespaceConfig = {
   name: 'CV Chat Namespace',
   path: '/cv-chat',
   events: [
      startChatEvent,
      assitantInboxEvent
   ],
   connectionHandler(socket) {
      console.log('CV Chat Namespace connected');
   }
};

export default cvChatNamespace;
