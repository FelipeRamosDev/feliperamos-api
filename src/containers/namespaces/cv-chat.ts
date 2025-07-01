import { NamespaceConfig } from '@/services/SocketServer';
import startChatEvent from './events/start-chat';

const cvChatNamespace: NamespaceConfig = {
   name: 'CV Chat Namespace',
   path: '/cv-chat',
   events: [
      startChatEvent
   ],
   connectionHandler(socket) {
      console.log('CV Chat Namespace connected');
   }
};

export default cvChatNamespace;
