import Thread from '../../services/ClusterManager/Thread';
import aiMainThread from '../threads/ai-main.thread';

declare global {
  var thread: Thread;
}

new Thread(aiMainThread);
