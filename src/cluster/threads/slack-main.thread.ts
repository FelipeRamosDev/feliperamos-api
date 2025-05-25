import { ThreadSetup } from '../../services/types/ClusterManager.types';

const slackMainThread: ThreadSetup = {
   tagName: 'slack-main',
   filePath: './dist/src/cluster/scripts/slack-main.script.js',
   onReady: () => {
      console.log('[THREAD] slack-main is ready!');
   },
   onError: (err) => {
      toError(`Something went wrong with "slack-main" thread! Error caught.`);
   },
   onClose: () => {
      console.log('[THREAD] slack-main was closed!');
   }
};

export default slackMainThread;
