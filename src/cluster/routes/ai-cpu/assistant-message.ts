import { EndpointSetup } from '../../../types/EventEndpoint.types';
import { AiCpuAssistantMessageDataResponse, AiCpuAssistantMessageDoneResponse } from '../../../types/routes/AiCpuAssistantMessage.types';

const aiCpuAssistantMessage: EndpointSetup = {
   path: '/ai-cpu/assistant-message',
   controller: (data: AiCpuAssistantMessageDataResponse, done: (res: AiCpuAssistantMessageDoneResponse) => void = () => {}) => {
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
      }).catch(err => {
         done(toError(err.message || err.msg || `Error occured when requesting response from OpenAI!`));
      });
   }
};

export default aiCpuAssistantMessage;
