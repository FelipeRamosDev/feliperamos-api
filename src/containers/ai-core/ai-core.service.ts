import 'dotenv/config';
import { AICore } from '../../services';
import newChatEvent from './events/common/new-chat.event';
import chatMessage from './events/common/chat-message.event';
import { resume } from './chats';

const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  throw new Error(`It's required to declare the env variable "OPENAI_API_KEY" to use the AI service!`);
}

global.aiCore = new AICore({
   id: 'ai-core',
   apiKey: OPENAI_API_KEY,
   endpoints: [
      newChatEvent,
      chatMessage
   ]
});


// Declaring the AI Chats
global.aiCore.setChatOptions(resume);

// export const assistantChatCV = global.service;
// export const assistantBuildCV = new AICore({
//    id: 'assistant-build-cv',
//    apiKey: OPENAI_API_KEY,
//    onServiceReady: function () {
//       console.log(`[${this.containerName}] AI service is ready!`);
//    },
//    onError: function (err) {
//       console.error(`[${this.containerName}] AI service encountered an error:`, err);
//    }
// });
