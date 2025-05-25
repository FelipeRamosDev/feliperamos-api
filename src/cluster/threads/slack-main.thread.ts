import { ThreadSetup } from '../../services/types/ClusterManager.types';

const slackMainThread: ThreadSetup = {
   tagName: 'slack-main',
   filePath: './dist/src/cluster/scripts/slack-main.script.js',
   onReady: () => {
      console.log('[THREAD] slack-main is ready!');
   },
   onError: (err) => {
      console.error(err);
   },
   onClose: () => {
      console.log('[THREAD] slack-main was closed!');
   }
};

export default slackMainThread;
