import { EndpointSetup } from '../../../models/EventEndpoint';

const thread: EndpointSetup = {
   path: '/api-server',
   controller: (data) => {
      console.log('Arrived at /api-server:', data);
   }
}

export default thread;
