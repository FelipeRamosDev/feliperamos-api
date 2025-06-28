import { EndpointSetup } from '../../../types/EventEndpoint.types';
import { AiCpuAssistantMessageDataResponse, AiCpuAssistantMessageDoneResponse } from '../../../types/routes/AiCpuAssistantMessage.types';

/**
 * Endpoint configuration for handling AI assistant message requests.
 * 
 * - Path: `/ai-cpu/assistant-message`
 * - Controller: Handles incoming requests for AI assistant responses.
 *   - Validates input.
 *   - Calls `ai.threadMessage` to get a response from the AI assistant.
 *   - Returns the result or an error via the `done` callback.
 */
const aiCpuAssistantMessage: EndpointSetup = {
   path: '/ai-cpu/assistant-message',
   /**
    * Controller for processing assistant message requests.
    * @param data - The request data containing input and optional threadID.
    * @param done - Callback to return the response or error.
    */
   controller: (
      data: AiCpuAssistantMessageDataResponse,
      done: (res: AiCpuAssistantMessageDoneResponse) => void = () => {}
   ) => {
      const { input, threadID } = data || {};

      if (!input) {
         return done(toError(`It's required to provide an input when requesting a GPT response!`));
      }

      ai.threadMessage(threadID, input).then(({ threadID, output }: any) => {
         done({
            success: true,
            threadID,
            output
         });
      }).catch((err: Error) => {
         done(toError(err.message || `Error occurred when requesting response from OpenAI!`));
      });
   }
};

export default aiCpuAssistantMessage;
