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

aiCore.startChat({
   label: 'Default Chat',
   smPath: 'src/prompts/system-prompts/cv-assistant.system.md',
}).then((chat) => {
   const agent = chat.setAgent({
      name: 'cv-agent',
      instructions: 'You are a helpful assistant that helps users to build their CVs.'
   });

   let added = false;
   process.stdin.on('data', async (data) => {
      const userMessage = data.toString().trim();
      const turn = agent.turn();

      if (!added) {
         added = true;
         turn.addInstructions('The user name is Felipe Ramos and he is a software developer.');
      }

      turn.addCell('user', userMessage);
      const stream = await turn.stream((text) => {
         process.stdout.write(text);
      });

      console.log('\n--- Turn completed ---\n');
   });
}).catch((error) => {
   console.error('Error starting default chat:', error);
});

export default aiCore;
