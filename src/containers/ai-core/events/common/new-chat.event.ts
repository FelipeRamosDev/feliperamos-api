import { EventEndpoint } from '../../../../services';
import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';

export default new EventEndpoint({
   path: '/ai-core/common/new-chat',
   async controller(data, done) {
      const { chatId, label } = Object(data);

      try {
         const chat = aiCore.startChat(label, chatId);

         done?.({
            success: true,
            chatId: chat.id,
            message: 'New chat started successfully.'
         });
      } catch (error: any) {
         done?.(new ErrorEventEndpoint(`Failed to start new chat: ${error.message}`, 'AI_CORE_NEW_CHAT_FAILED').toObject()); 
      }
   }
});
