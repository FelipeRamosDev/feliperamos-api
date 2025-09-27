import { NamespaceConfig } from '../../../services/SocketServer';
import generateLetter from './events/generate-letter';

const coverLetterNamespace: NamespaceConfig = {
   name: 'Cover-letter Namespace',
   path: '/cover-letter',
   events: [ generateLetter ],
   connectionHandler(socket) {
      console.log('Cover-letter Namespace connected');
   }
};

export default coverLetterNamespace;
