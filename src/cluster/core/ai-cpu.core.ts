import { CoreSetup } from '../../types/ClusterManager.types';
import aiMainThread from '../threads/ai-main.thread';

const aiCPU: CoreSetup = {
   tagName: 'ai-cpu',
   threads: [ aiMainThread ],
   onReady: () => {
      console.log('[CORE] ai-cpu is ready!');
   },
   onError: (err) => {
      toError(`Something went wrong with the "ai-cpu" core! Error caught.`);
   },
   onClose: () => {
      console.log('[CORE] ai-cpu was closed!');
   }
}

export default aiCPU;
