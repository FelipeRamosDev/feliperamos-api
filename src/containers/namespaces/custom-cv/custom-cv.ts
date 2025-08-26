import { NamespaceConfig } from '../../../services/SocketServer';
import generateSummary from './events/generate-summary';

const cvChatNamespace: NamespaceConfig = {
   name: 'Custom-CV Namespace',
   path: '/custom-cv',
   events: [
      generateSummary
   ],
   connectionHandler(socket) {
      console.log('Custom-CV Namespace connected');
   }
};

export default cvChatNamespace;
