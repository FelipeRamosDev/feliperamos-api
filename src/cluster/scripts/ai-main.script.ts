import AI from '../../services/AI';
import Thread from '../../services/ClusterManager/Thread';
import aiMainThread from '../threads/ai-main.thread';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!OPENAI_API_KEY) {
  throw `It's required to declare the env variable OPENAI_API_KEY to use the AI service!`;
}

new Thread(aiMainThread);

global.ai = new AI({ apiKey: OPENAI_API_KEY, assistantID: OPENAI_ASSISTANT_ID });
