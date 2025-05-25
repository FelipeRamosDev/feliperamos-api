import 'dotenv/config';
import Cluster from './src/services/ClusterManager/Cluster';
import slackAppCore from './src/cluster/core/slack-app.core';
import aiCPUCore from './src/cluster/core/ai-cpu.core';

new Cluster({
   tagName: 'feliperamos-cv',
   cores: [ slackAppCore, aiCPUCore ],
   onReady: () => {
      console.log('[CLUSTER] Cluster is ready!');
   },
   onError: (err) => {
      console.error(err);
   },
   onClose: () => {
      console.log('[CLUSTER] The cluster was closed!');
   }
});
