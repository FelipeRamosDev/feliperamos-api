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
