import { NamespaceConfig } from '../../../services/SocketServer';
import generateSummary from './events/generate-summary';
import scrapLinkedInJob from './events/scrap-linkedin-job';

const opportunitiesNamespace: NamespaceConfig = {
   name: 'Opportunities Namespace',
   path: '/opportunities',
   events: [
      generateSummary,
      scrapLinkedInJob
   ],
   connectionHandler(socket) {
      console.log('Opportunities Namespace connected');
   }
};

export default opportunitiesNamespace;
