import { ThreadSetup } from '../../services/types/ClusterManager.types';
import aiCpuAssistantMessage from '../routes/ai-cpu/assistant-message';

const aiMainThread: ThreadSetup = {
   tagName: 'ai-main',
   filePath: './dist/src/cluster/scripts/ai-main.script.js',
   routes: [ aiCpuAssistantMessage ],
   onReady: () => {
      console.log('[THREAD] ai-main is ready!');
   },
   onError: (err) => {
      toError(`Something went wrong with "ai-main" thread! Error caught.`);
   },
   onClose: () => {
      console.log('[THREAD] ai-main was closed!');
   }
}

export default aiMainThread;
