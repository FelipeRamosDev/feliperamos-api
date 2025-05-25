import { CoreSetup } from '../../services/types/ClusterManager.types';
import slackMainThread from '../threads/slack-main.thread';

const slackAppCore: CoreSetup = {
   tagName: 'slack-app',
   threads: [ slackMainThread ],
   onReady: () => {
      console.log('[CORE] slack-app is ready!');
   },
   onError: (err) => {
      console.error(err);
   },
   onClose: () => {
      console.log('[CORE] slack-app was closed!');
   }
}

export default slackAppCore;
