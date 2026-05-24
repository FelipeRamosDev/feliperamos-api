import AICoreChat from '../../../../services/AICore/AICoreChat';
import { ResumeBot, SummaryGen, LetterGen } from '../../agents';

export default AICoreChat.buildChatOptions({
   label: 'resume',
   model: 'gpt-4o',
   instructionsPath: 'src/containers/ai-core/chats/resume/resume.system.md',
   agents: [ ResumeBot, SummaryGen, LetterGen ]
});
