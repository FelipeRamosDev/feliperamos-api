import AIAgent from '../../../../services/AICore/AIAgent';

export default new AIAgent({
   name: 'resume-bot',
   label: 'Resume Bot',
   model: 'gpt-5-mini',
   instructionsPath: 'src/containers/ai-core/agents/ResumeBot/ResumeBot.system.md',
   modelSettings: {
      parallelToolCalls: true,
      reasoning: { effort: 'low' }
   }
});
