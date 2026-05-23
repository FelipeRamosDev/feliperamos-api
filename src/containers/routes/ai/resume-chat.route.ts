import { Route } from "@/services";
import ErrorResponseServerAPI from "@/services/ServerAPI/models/ErrorResponseServerAPI";

export const evaluateTurnRoute = new Route({
   method: 'POST',
   routePath: '/ai-core/resume-chat',
   controller: async (req, res) => {
      let { chatId, message } = req.body;

      try {
         if (!chatId) {
            chatId = await new Promise((resolve, reject) => {
               service.sendTo('/ai-core/common/new-chat', { label: 'resume' }, ({ error, message, code, chatId }) => {
                  if (error) {
                     const error = new ErrorResponseServerAPI(message || 'Error creating new chat', 400, code || 'NEW_CHAT_FAILED').send(res);
                     return reject(error);
                  }

                  resolve(chatId);
               });
            });
         }

         if (!message) {
            new ErrorResponseServerAPI('Message is required to evaluate turn', 400, 'MESSAGE_REQUIRED').send(res);
            return;
         }

         service.sendTo('/ai-core/common/chat-message', { chatId, message }, ({ error, message, code, result }) => {
            if (error) {
               new ErrorResponseServerAPI(message || 'Error evaluating turn', 400, code || 'EVALUATE_TURN_FAILED').send(res);
               return;
            }

            res.send({ chatId, result });
         });
      } catch (error: any) {
         new ErrorResponseServerAPI(`Failed to evaluate turn: ${error?.message} (${error?.code})`, 500, 'EVALUATE_TURN_FAILED').send(res);
      }
   }
});
