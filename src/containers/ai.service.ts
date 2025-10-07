import 'dotenv/config';
import { AICore } from '../services';
import getChatRoute from './routes/ai/get-chat.route';

const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_ASSISTANT_BUILD_CV } = process.env;
if (!OPENAI_API_KEY) {
   throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

process.env.test = 'test';
const aiCore = new AICore({
   id: 'ai-core',
   containerName: 'ai-service',
   apiKey: OPENAI_API_KEY,
   endpoints: [
      getChatRoute
   ]
});

export default aiCore;
