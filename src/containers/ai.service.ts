import 'dotenv/config';
import { AICore } from '../services';
import assistantGenerateRoute from './routes/ai/assistant-generate.route';
import generateCvSummaryRoute from './routes/ai/generate-cv-summary.route';
import generateLetterRoute from './routes/ai/generate-letter.route';

const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

global.service = new AICore({
   id: 'ai',
   apiKey: OPENAI_API_KEY,
   endpoints: [
      assistantGenerateRoute,
      generateCvSummaryRoute,
      generateLetterRoute
   ],
   onServiceReady: function () {
      console.log(`[${this.containerName}] AI service is ready!`);
   },
   onError: function (err) {
      console.error(`[${this.containerName}] AI service encountered an error:`, err);
   }
});

export const assistantChatCV = global.service;
export const assistantBuildCV = new AICore({
   id: 'assistant-build-cv',
   apiKey: OPENAI_API_KEY,
   onServiceReady: function () {
      console.log(`[${this.containerName}] AI service is ready!`);
   },
   onError: function (err) {
      console.error(`[${this.containerName}] AI service encountered an error:`, err);
   }
});
