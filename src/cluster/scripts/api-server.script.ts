import Thread from '../../services/InstanceManager/Thread';
import apiServerThread from '../threads/api-server.thread';

const thread = new Thread(apiServerThread);

setTimeout(() => thread.sendTo('/', { testing: Date.now() }), 5000);
