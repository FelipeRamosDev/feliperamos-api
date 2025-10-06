import { NonStreamRunOptions, run, StreamRunOptions } from '@openai/agents';
import AIAgent from './AIAgent';
import { AIAgentResultSetup } from './AICore.types';
import AICoreResult from './AICoreResult';
import ErrorAICore from './ErrorAICore';

export default class AIAgentResult<TContext = {}> extends AICoreResult {
   private _aiAgent: AIAgent<TContext>;
   private _options: NonStreamRunOptions | StreamRunOptions;

   constructor (setup: AIAgentResultSetup = {}, aiAgent: AIAgent<TContext>) {
      super(setup);
      const { model = AIAgent.defaultModel } = setup || {};

      this._aiAgent = aiAgent;
      this._options = {};

      this.parentInstructions = this.aiAgent.instructions;
      this.setModel(model || this.aiAgent.model || AIAgent.defaultModel);
   }

   private get aiAgent(): AIAgent<TContext> {
      return this._aiAgent;
   }

   public get parsedInput() {
      return this.input.map(cell => cell.toAgentInputItem());
   }
   public get options(): NonStreamRunOptions | StreamRunOptions {
      return this._options;
   }

   public setOptions(options: NonStreamRunOptions | StreamRunOptions): this {
      this._options = { ...this._options, ...options };
      return this;
   }

   public async run() {
      if (!this.aiAgent) {
         throw new ErrorAICore(`No aiAgent associated with this result.`, 'ERROR_NO_AGENT_ASSOCIATED');
      }

      try {
         const result = await run(this.aiAgent.agent, this.parsedInput, this.options as NonStreamRunOptions);
         return result;
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'Failed to run aiAgent.', 'ERROR_RUNNING_AGENT');
      }
   }

   public async stream(onText: (text: string) => void) {
      if (!this.aiAgent) {
         throw new ErrorAICore(`No aiAgent associated with this result.`, 'ERROR_NO_AGENT_ASSOCIATED');
      }

      return new Promise(async (resolve, reject) => {
         this.setOptions({ stream: true });

         try {
            const result = await run(this.aiAgent.agent, this.parsedInput, this.options as StreamRunOptions);
            const textStream = result.toTextStream({ compatibleWithNodeStreams: true });

            textStream.on('data', (chunk) => onText?.(chunk));
            result.completed.then(() => {
               resolve(result);
            }).catch(reject);
         } catch (error: any) {
            reject(new ErrorAICore(error.message || 'Failed to run aiAgent.', 'ERROR_RUNNING_AGENT'));
         }
      });
   }
}
