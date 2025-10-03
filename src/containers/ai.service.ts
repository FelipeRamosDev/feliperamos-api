import 'dotenv/config';
import { AICore } from '../services';
import getChatRoute from './routes/ai/get-chat.route';

const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_ASSISTANT_BUILD_CV } = process.env;
if (!OPENAI_API_KEY) {
   throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

const aiCore = new AICore({
   id: 'ai-core',
   containerName: 'ai-service',
   apiKey: OPENAI_API_KEY,
   endpoints: [
      getChatRoute
   ]
});

aiCore.startChat({
   system_type: 'test-service',
   label: 'Test Service Chat',
   smPath: 'src/prompts/system-prompts/cv-assistant.system.md',
}).then(chat => {
   process.stdout.write('\n\n> ');
   process.stdin.on('data', async (data) => {
      const message = data.toString().trim();
      const response = chat.response();

      response.addCell('user', message);
      response.stream({
         onOutputTextDelta(event) {
            process.stdout.write(event.delta);
         },
         onComplete(event) {
            process.stdout.write('\n\n> ');
         },
      })
   });
}).catch(error => {
   console.error(`Failed to start AI Service:`, error);
});

export default aiCore;
