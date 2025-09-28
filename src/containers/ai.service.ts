import 'dotenv/config';
import { AICore } from '../services';

const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_ASSISTANT_BUILD_CV } = process.env;
if (!OPENAI_API_KEY) {
  throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

const aiCore = new AICore({
   id: 'ai-core',
   containerName: 'ai-service',
   apiKey: OPENAI_API_KEY,
});

aiCore.startChat({
   label: 'main-chat',
   smPath: 'src/containers/chatSM.md'
}).then(async chat => {
   const response1 = chat.response();

   const userCell1 = response1.addCell('user', 'Hello, check this file for me...');
   userCell1.attachFileByID('file-17aABekSPR8fu5u4uMi3Mt');
   userCell1.attachFileByID('file-3BAKaNaMyPyS7PkbLmtor6');

   const result1 = await response1.create();
   console.log(result1.output);

   const response2 = chat.response();
   response2.addCell('user', 'Check if it\'s ATS optimized.');

   const result2 = await response2.create();
   console.log(result2.output);

   debugger;
}).catch(err => {
   console.error('Error starting chat:', err);
});
