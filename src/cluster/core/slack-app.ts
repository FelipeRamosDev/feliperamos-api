import { CoreSetup } from '../../services/InstanceManager/Core';
import generateResponseSlackAppRoute from '../routes/slack-app/generate-response';

const core: CoreSetup = {
   tagName: 'slack-app',
   threads: [  ],
   routes: [ generateResponseSlackAppRoute ],
   onReady() {
      console.log('\n[CORE] "slack-app" is ready!');
   },
   onError(err) {
      console.error(err);
   }
};

export default core;
