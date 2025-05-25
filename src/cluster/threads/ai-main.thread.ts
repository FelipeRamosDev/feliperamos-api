import { ThreadSetup } from '../../services/types/ClusterManager.types';

const aiMainThread: ThreadSetup = {
   tagName: 'ai-main',
   filePath: './dist/src/cluster/scripts/ai-main.script.js',
   onReady: () => {
      console.log('[THREAD] ai-main is ready!');
   },
   onError: (err) => {
      console.error(err);
   },
   onClose: () => {
      console.log('[THREAD] ai-main was closed!');
   }
}

export default aiMainThread;
