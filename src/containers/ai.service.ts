import 'dotenv/config';
import { AI } from '../services';
import assistentMessageRoute from './routes/ai/assistant-message.route';

const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } = process.env;
if (!OPENAI_API_KEY) {
  throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

global.service = new AI({
   id: 'ai-service',
   apiKey: OPENAI_API_KEY,
   assistantID: OPENAI_ASSISTANT_ID,
   endpoints: [
      assistentMessageRoute
   ],
   onServiceReady: function () {
      console.log(`[${this.containerName}] AI service is ready!`);
   },
   onError: function (err) {
      console.error(`[${this.containerName}] AI service encountered an error:`, err);
   }
});
