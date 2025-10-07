import { NonStreamRunOptions, run, StreamedRunResult, StreamRunOptions } from '@openai/agents';
import AIAgent from '../AIAgent';
import { AIAgentTurnSetup } from '../AICore.types';
import AICoreTurn from './AICoreTurn';
import ErrorAICore from '../ErrorAICore';
import AgentOutputItemModel from './AgentOutputItemModel';
import { defaultModel } from '../../../app.config';

export default class AIAgentTurn extends AICoreTurn {
   private _aiAgent: AIAgent;
   private _options: NonStreamRunOptions | StreamRunOptions;

   constructor (setup: AIAgentTurnSetup = {}, aiAgent: AIAgent) {
      super(setup, aiAgent);
      const { model } = setup || {};

      this._aiAgent = aiAgent;
      this._options = {};

      this.parentInstructions = this.aiAgent.instructions;
      this.setModel(model || this.aiAgent.model || defaultModel);
   }

   private get aiAgent(): AIAgent {
      return this._aiAgent;
   }

   public get parsedInput() {
      return this.aiAgent.history.map(item => item.toAgentInputItem());
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
         this.aiAgent.setHistoryBulk(this.input);
         const result = await run(this.aiAgent.agent, this.parsedInput, this.options as NonStreamRunOptions);

         this.aiAgent.setHistoryBulk(result.output as AgentOutputItemModel[]);
         return result;
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'Failed to run aiAgent.', 'ERROR_RUNNING_AGENT');
      }
   }

   public async stream(onChunk: (text: string) => void): Promise<StreamedRunResult<undefined, any>> {
      if (!this.aiAgent) {
         throw new ErrorAICore(`No aiAgent associated with this result.`, 'ERROR_NO_AGENT_ASSOCIATED');
      }

      return new Promise(async (resolve, reject) => {
         try {
            this.setOptions({ stream: true });
            this.aiAgent.setHistoryBulk(this.input);

            const result = await run(this.aiAgent.agent, this.parsedInput, this.options as StreamRunOptions);
            const textStream = result.toTextStream({ compatibleWithNodeStreams: true });

            textStream.on('data', (chunk) => onChunk?.(chunk));
            result.completed.then(() => {
               this.aiAgent.setHistoryBulk(result.output as AgentOutputItemModel[]);
               resolve(result);
            }).catch(reject);
         } catch (error: any) {
            reject(new ErrorAICore(error.message || 'Failed to run aiAgent.', 'ERROR_RUNNING_AGENT'));
         }
      });
   }
}
