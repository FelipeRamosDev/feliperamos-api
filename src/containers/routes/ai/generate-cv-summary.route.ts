import ErrorEventEndpoint from '../../../services/EventEndpoint/ErrorEventEndpoint';
import { AI, EventEndpoint } from '../../../services';
import type { GenerateSummaryParams } from '../../types/routes/ai/generate-cv-summary.types';
import generateCVSummaryPrompt from '../../../prompts/generate-cv-summary';
import { assistantBuildCV } from '../../../containers/ai.service';

export default new EventEndpoint({
   path: '/ai/generate-cv-summary',
   controller: (params: GenerateSummaryParams = {}, done = () => {}) => {
      const { jobDescription = '', threadID, customPrompt = '', currentInput = '' } = params || {};

      if (!(assistantBuildCV instanceof AI)) {
         return done(new ErrorEventEndpoint(`The assistantBuildCV service is not available!`, 'AI_SERVICE_NOT_AVAILABLE'));
      }

      const prompt = generateCVSummaryPrompt(jobDescription, currentInput, customPrompt);
      assistantBuildCV.threadMessage(threadID, prompt).then(({ threadID: newThreadID, output }: any) => {
         done({
            success: true,
            threadID: newThreadID,
            summary: output || null
         });
      }).catch((err: Error) => {
         done(toError(err.message || `Error occurred when requesting response from OpenAI!`));
      });
   }
});
