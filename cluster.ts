import Cluster from './src/services/InstanceManager/Cluster';
import apiServer from './src/cluster/core/api-server';
import slackApp from './src/cluster/core/slack-app';
import clusterRoute from './src/cluster/routes/index';

const cluster = new Cluster({
   tagName: 'feliperamos-cv',
   cores: [ apiServer, slackApp ],
   routes: [ clusterRoute ],
   onReady: () => {
      console.log('Cluster is ready!');
      setTimeout(() => cluster.sendTo('/api-server', { testing: Date.now() }), 5000);
      setTimeout(() => cluster.sendTo('/slack-app/generate-response', { testing: Date.now() }), 8000);
   },
   onError: (err) => {
      console.error(err);
   }
});

