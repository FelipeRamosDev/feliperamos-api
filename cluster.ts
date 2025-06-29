import 'dotenv/config';
import './src/global/globals';
import { Cluster } from './src/services';
import slackAppCore from './src/cluster/core/slack-app.core';

new Cluster({
   tagName: 'feliperamos-cv',
   cores: [ slackAppCore ],
   onReady: () => {
      console.log('[CLUSTER] Cluster is ready!');
   },
   onError: (err) => {
      toError('Something went wrong with the cluster!');
   },
   onClose: () => {
      console.log('[CLUSTER] The cluster was closed!');
   }
});
