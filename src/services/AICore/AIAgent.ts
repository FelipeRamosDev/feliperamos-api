import { Agent } from '@openai/agents';
import { AIAgentResultSetup, AIAgentSetup, AIModels } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AICore from './AICore';
import AIAgentResult from './AIAgentResult';

export default class AIAgent<TContext = {}> {
   private _agent: Agent<TContext>;

   public name: string;
   public model: AIModels;
   public instructions?: string;

   static defaultModel: AIModels = AICore.defaultModel;

   constructor(setup: AIAgentSetup) {
      const { apiKey, name, model = AIAgent.defaultModel, instructions } = setup || {};

      if (!name || !name.trim().length || typeof name !== 'string') {
         throw new ErrorAICore(`It's required to provide a valid name to create an AI Agent!`, 'ERROR_INVALID_AGENT_NAME');
      }

      if (apiKey && (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY !== apiKey)) {
         process.env.OPENAI_API_KEY = apiKey;
      }

      this.name = name;
      this.model = model;
      this.instructions = instructions;

      this._agent = new Agent<TContext>({
         name,
         model,
         instructions
      });
   }

   public get agent(): Agent<TContext> {
      return this._agent;
   }

   turn(setup?: AIAgentResultSetup): AIAgentResult<TContext> {
      return new AIAgentResult(setup, this);
   }
}
