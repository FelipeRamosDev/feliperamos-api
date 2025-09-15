import ErrorSocketServer from '../../../services/SocketServer/ErrorSocketServer';
import { EventEndpoint } from '../../../services';
import { assistantBuildCV } from '../../ai.service';
import generateCoverLetterPrompt from '../../../prompts/generate-letter';

export default new EventEndpoint({
   path: '/ai/generate-letter',
   controller: (data = {}, done = () => {}) => {
      const { aiThreadID, currentLetter, jobDescription, additionalMessage } = data;
      const prompt = generateCoverLetterPrompt(jobDescription, currentLetter, additionalMessage);

      assistantBuildCV.threadMessage(aiThreadID, prompt).then((response) => {
         if (!response) {
            throw new ErrorSocketServer('Error generating cover letter', 'AI_GENERATE_LETTER_ERROR');
         }

         done({ success: true, output: response.output });
      }).catch(error => {
         done(new ErrorSocketServer(error.message || 'Error generating cover letter', error.code || 'AI_GENERATE_LETTER_ERROR'));
      });
   }
});
