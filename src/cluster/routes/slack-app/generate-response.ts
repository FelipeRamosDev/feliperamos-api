import { EndpointSetup } from '../../../models/EventEndpoint';

const thread: EndpointSetup = {
   path: '/slack-app/generate-response',
   controller: (data) => {
      console.log('Arrived at /slack-app/generate-response:', data);
   }
}

export default thread;
