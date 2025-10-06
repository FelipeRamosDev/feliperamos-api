import 'dotenv/config';
import { AICore } from '../services';
import getChatRoute from './routes/ai/get-chat.route';
import AIAgent from '../services/AICore/AIAgent';

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

// aiCore.startChat({
//    label: 'Default Assistant',
//    smPath: 'src/prompts/system-prompts/cv-assistant.system.md',
//    system_type: 'cv-assistant',
// }).then(chat => {
//    process.stdin.on('data', async (data) => {
//       const userInput = data.toString().trim();
//       const response = chat.response();

//       const userCell = response.addCell('user', userInput);
//       debugger
//    });
// }).catch(console.error);

const agent = new AIAgent({
   name: 'My Accountant',
   instructions: 'Você é meu contador e irá me ajudar com o meu importo de renda para a Receita Federal do Brasil.',
});

process.stdin.on('data', async (data) => {
   const userInput = data.toString().trim();
   const turn = agent.turn()

   turn.setInstructions('Minha renda mensal é de R$ 20.000,00.');
   turn.addCell('user', userInput);

   turn.stream((text) => {
      process.stdout.write(text);
   });
});


export default aiCore;
