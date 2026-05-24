import AIAgent from '../../../../services/AICore/AIAgent';
import outputSchema from './SummaryGen.output';

interface SummaryGenContext {
   jobDescription?: string;
   jobTitle?: string;
   jobCompany?: string;
}

interface SummaryGenOutput {
   summary: string | '';
   feedback: string | '';
}

export default new AIAgent<SummaryGenContext, SummaryGenOutput>({
   name: 'summary-gen',
   label: 'Summary Generator',
   model: 'gpt-5-mini',
   outputType: outputSchema,
   instructionsPath: 'src/containers/ai-core/agents/SummaryGen/SummaryGen.system.md',
   modelSettings: {
      parallelToolCalls: true,
      reasoning: { effort: 'low' }
   }
});
