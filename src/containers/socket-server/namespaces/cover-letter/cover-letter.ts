import { NamespaceConfig } from '../../../../services/SocketServer';
import generateLetter from './events/generate-letter';
import startLetter from './events/start-letter';

const coverLetterNS: NamespaceConfig = {
   name: 'Cover Letter',
   path: '/cover-letter',
   events: [ startLetter, generateLetter ],
   connectionHandler: (socket) => {
      console.log(`Client connected to Cover Letter namespace: ${socket.id}`);
   },
}

export default coverLetterNS;

