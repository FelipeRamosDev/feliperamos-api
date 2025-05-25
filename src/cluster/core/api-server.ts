import { CoreSetup } from '../../services/InstanceManager/Core';
import apiServerThread from '../threads/api-server.thread';

const core: CoreSetup = {
   tagName: 'api-server',
   threads: [ apiServerThread ],
   onReady() {
      console.log('\n[CORE] "api-server" is ready!');
   },
   onError(err) {
      console.error(err);
   }
};

export default core;
