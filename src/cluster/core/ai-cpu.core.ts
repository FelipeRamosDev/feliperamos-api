import { CoreSetup } from '../../services/types/ClusterManager.types';
import aiMainThread from '../threads/ai-main.thread';

const aiCPU: CoreSetup = {
   tagName: 'ai-cpu',
   threads: [ aiMainThread ],
   onReady: () => {
      console.log('[CORE] ai-cpu is ready!');
   },
   onError: (err) => {
      console.error(err);
   },
   onClose: () => {
      console.log('[CORE] ai-cpu was closed!');
   }
}

export default aiCPU;
