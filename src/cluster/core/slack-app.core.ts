import { CoreSetup } from '../../types/ClusterManager.types';
import slackMainThread from '../threads/slack-main.thread';

const slackAppCore: CoreSetup = {
   tagName: 'slack-app',
   threads: [ slackMainThread ],
   onReady: () => {
      console.log('[CORE] slack-app is ready!');
   },
   onError: (err) => {
      toError(`Something went wrong with the "slack-app" core! Error caught.`);
   },
   onClose: () => {
      console.log('[CORE] slack-app was closed!');
   }
}

export default slackAppCore;
