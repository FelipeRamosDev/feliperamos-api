import AIAgent from '../../../../services/AICore/AIAgent';
import letterGenOutput from './LetterGen.output';

export default new AIAgent<null, typeof letterGenOutput>({
   name: 'letter-gen',
   label: 'Letter Generator',
   model: 'gpt-5.1',
   outputType: letterGenOutput,
   instructionsPath: 'src/containers/ai-core/agents/LetterGen/LetterGen.system.md',
   modelSettings: {
      parallelToolCalls: true,
      // reasoning: { effort: 'low' }
   }
});
