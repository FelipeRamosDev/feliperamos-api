import Thread from '../../services/InstanceManager/Thread';
import apiServerRoute from '../routes/api-server';

export default new Thread({
   tagName: 'api-server:main',
   filePath: './dist/src/cluster/scripts/api-server.script.js',
   routes: [ apiServerRoute ],
   onReady() {
      console.log('\n[THREAD] "api-server" is ready!');
   },
   onError(err) {
      console.error(err);
   }
});

