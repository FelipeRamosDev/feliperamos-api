import { EndpointSetup } from '../../models/EventEndpoint';

const thread: EndpointSetup = {
   path: '/',
   controller: (data) => {
      console.log('Arrived at /:', data);
   }
}

export default thread;

