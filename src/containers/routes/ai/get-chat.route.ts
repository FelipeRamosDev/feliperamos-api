import { EventEndpoint } from '../../../services';
import ErrorEventEndpoint from '../../../services/EventEndpoint/ErrorEventEndpoint';
import aiService from '../../ai.service'

export default new EventEndpoint({
   path: '/ai/get-chat',
   controller: (data = {}, done = () => {}) => {
      const { chatId } = data;

      try {
         const chat = aiService.getChat(chatId);
   
         if (!chat) {
            return done(new ErrorEventEndpoint(`Chat with id "${chatId}" not found.`, 'AI_GET_CHAT_NOT_FOUND').toObject());
         }
   
         done(chat.toObject());
      } catch (error: any) {
         done(new ErrorEventEndpoint(error.message || `Failed to get chat with id "${chatId}": ${error.message}`, 'AI_GET_CHAT_ERROR').toObject());
      }
   }
});
