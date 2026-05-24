import { EventEndpoint } from '../../../../services';
import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';

export default new EventEndpoint({
   path: '/ai-core/common/chat-message',
   async controller(data, done) {
      const { chatId, message, agentId, forwardEnd, context, stream } = Object(data);

      try {
         const chat = aiCore.getChat(chatId);
         if (!chat) {
            return done?.(new ErrorEventEndpoint(`Chat with ID ${chatId} not found.`, 'AI_CORE_CHAT_NOT_FOUND'));
         }

         if (!agentId) {
            return done?.(new ErrorEventEndpoint(`Agent ID is required.`, 'AI_CORE_AGENT_ID_REQUIRED'));
         }

         const agent = chat.getAgent(agentId);
         if (!agent) {
            return done?.(new ErrorEventEndpoint(`Agent '${agentId}' not found in chat ${chatId}.`, 'AI_CORE_AGENT_NOT_FOUND'));
         }

         const messageId = `${chatId}_${agent.history.length}`;
         const turn = agent.turn();
         turn.addCell('user', message);
         turn.setOptions({ context });

         let result;
         if (stream) {
            result = await turn.stream((chunk: string) => {
               global.aiCore.sendTo('/socket-server/message-chunk', { roomId: chatId, messageId, chunk });
            }, (error: any) => {
               console.error(`Error streaming AI response for chat ${chatId}:`, error);
               global.aiCore.sendTo('/socket-server/message-error', { roomId: chatId, error });
            });
         } else {
            result = await turn.run();
         }

         if (!result) {
            return done?.(new ErrorEventEndpoint(`No response from AI agent.`, 'AI_CORE_NO_RESPONSE'));
         }

         global.aiCore.sendTo(forwardEnd || '/socket-server/message-end', { roomId: chatId, messageId, finalOutput: result.finalOutput });
         done?.({ success: true, messageId, roomId: chatId, finalOutput: result.finalOutput });
      } catch (error: any) {
         const err = new ErrorEventEndpoint(`Failed to send message: ${error?.message || ''}`, error?.code || 'AI_CORE_NEW_CHAT_FAILED');

         global.aiCore.sendTo('/socket-server/message-error', { roomId: chatId, error: err });
         done?.(err);
      }
   }
});
