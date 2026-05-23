import AICoreChat from '../../../../services/AICore/AICoreChat';
import { ResumeBot } from '../../agents';
import SummaryGen from '../../agents/SummaryGen/SummaryGen';

export default AICoreChat.buildChatOptions({
   label: 'resume',
   model: 'gpt-4o',
   instructionsPath: 'src/containers/ai-core/chats/resume/resume.system.md',
   agents: [ ResumeBot, SummaryGen ]
});
