import EventEndpoint from '../../../models/EventEndpoint';
import { AI } from '../../../services';
import { AssistantMessageDataResponse, AssistantMessageDoneResponse } from '../../types/routes/ai/assistant-message.types';

export default new EventEndpoint({
   path: '/ai-service/assistant-message',
   controller: (
      data: AssistantMessageDataResponse = {},
      done: (res: AssistantMessageDoneResponse) => void = () => {}
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
