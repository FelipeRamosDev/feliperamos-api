import { Agent } from '@openai/agents';
import { AIAgentResultSetup, AIAgentSetup, AIModels } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AICore from './AICore';
import AIAgentResult from './models/AIAgentResult';
import AIHistory from './models/AIHistory';
import AIHistoryItem from './models/AIHistoryItem';
import AICoreInputCell from './models/AICoreInputCell';
import AICoreOutputCell from './models/AICoreOutputCell';

export default class AIAgent<TContext = {}> {
   private _agent: Agent<TContext>;
   private _history: AIHistory;

   public name: string;
   public model: AIModels;
   public instructions?: string;

   public static defaultModel: AIModels = AICore.defaultModel;

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

      // Private
      this._history = new AIHistory();
      this._agent = new Agent<TContext>({
         name,
         model,
         instructions
      });
   }

   public get agent(): Agent<TContext> {
      return this._agent;
   }

   public get history(): AIHistoryItem[] {
      return Array.from(this._history.values());
   }

   public get setHistoryItem() {
      return this._history.setItem.bind(this._history);
   }

   public get setHistoryBulk() {
      return this._history.setBulk.bind(this._history);
   }

   public get getHistoryItem() {
      return this._history.getItem.bind(this._history);
   }

   public turn(setup?: AIAgentResultSetup): AIAgentResult<TContext> {
      return new AIAgentResult(setup, this);
   }
}
