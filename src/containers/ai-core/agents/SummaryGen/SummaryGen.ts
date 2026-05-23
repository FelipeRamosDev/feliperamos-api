import AIAgent from '../../../../services/AICore/AIAgent';

export default new AIAgent({
   name: 'summary-gen',
   label: 'Summary Generator',
   model: 'gpt-5-mini',
   instructionsPath: 'src/containers/ai-core/agents/SummaryGen/SummaryGen.system.md',
   modelSettings: {
      parallelToolCalls: true,
      reasoning: { effort: 'low' }
   }
});
