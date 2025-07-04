import { AI, EventEndpoint } from '../../../services';
import { AssistantGenerateDataResponse, AssistantGenerateDoneResponse } from '../../types/routes/ai/assistant-generate.types';

export default new EventEndpoint({
   path: '/ai/assistant-generate',
   controller: (
      data: AssistantGenerateDataResponse = {},
      done: (res: AssistantGenerateDoneResponse) => void = () => {}
   ) => {
      const { input, threadID } = data;

      if (!input) {
         return done(toError(`It's required to provide an input when requesting a GPT response!`));
      }

      if (!(service instanceof AI)) {
         return done(toError(`The AI service is not available!`));
      }

      service.threadMessage(threadID, input).then(({ threadID, output }: any) => {
         done({
            success: true,
            threadID,
            output
         });
      }).catch((err: Error) => {
         done(toError(err.message || `Error occurred when requesting response from OpenAI!`));
      });
   }
});
