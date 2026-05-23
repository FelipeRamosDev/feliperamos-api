import { NamespaceConfig } from '../../../../services/SocketServer'
import generateSummaryEvent from './events/generate-summary';
import scrapeLinkedInJobEvent from './events/scrape-linkedin-job';
import startBuildEvent from './events/start-build';

const opportunityNS: NamespaceConfig = {
   name: 'Opportunity',
   path: '/opportunity',
   events: [ startBuildEvent, scrapeLinkedInJobEvent, generateSummaryEvent ],
   connectionHandler: (socket) => {
      console.log(`Client connected to Opportunity namespace: ${socket.id}`);
   },
}

export default opportunityNS;
