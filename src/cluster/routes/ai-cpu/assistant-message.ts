import { EndpointSetup } from '../../../types/EventEndpoint.types';

const aiCpuAssistantMessage: EndpointSetup = {
   path: '/ai-cpu/assistant-message',
   controller: (data = {}, done = () => {}) => {
      const { input, threadID } = data;

      ai.threadMessage(threadID, input).then(({ threadID, output }: any) => {
         done({
            success: true,
            threadID,
            output
         });
      }).catch(err => {
         done({
            error: true,
            data: err
         });
      });
   }
};

export default aiCpuAssistantMessage;
