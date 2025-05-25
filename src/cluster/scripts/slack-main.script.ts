import Thread from '../../services/ClusterManager/Thread';
import slackMainThread from '../threads/slack-main.thread';

const thread = new Thread(slackMainThread);

thread.init();
console.log(process.env.OPENAI_API_KEY);
