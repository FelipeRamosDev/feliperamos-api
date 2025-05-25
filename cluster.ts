import Cluster from './src/services/ClusterManager/Cluster';

new Cluster({
   tagName: 'feliperamos-cv',
   cores: [ ],
   onReady: () => {
      console.log('Cluster is ready!');
   }
});
