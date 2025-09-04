import { NamespaceConfig } from '../../../services/SocketServer';
import generateSummary from './events/generate-summary';
import scrapeLinkedInJob from './events/scrape-linkedin-job';

const opportunitiesNamespace: NamespaceConfig = {
   name: 'Opportunities Namespace',
   path: '/opportunities',
   events: [
      generateSummary,
      scrapeLinkedInJob
   ],
   connectionHandler(socket) {
      console.log('Opportunities Namespace connected');
   }
};

export default opportunitiesNamespace;
