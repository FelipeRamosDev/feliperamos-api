import { Agent } from '@openai/agents';
import { AIAgentTurnSetup, AIAgentSetup, AIModels } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AIAgentTurn from './models/AIAgentTurn';
import AIHistory from './models/AIHistory';
import AIHistoryItem from './models/AIHistoryItem';
import { defaultModel } from '../../app.config';
import AICoreChat from './AICoreChat';

export default class AIAgent<TContext = any> {
   private _aiChat?: AICoreChat;
   private _agent: Agent<TContext>;
   private _history: AIHistory;
   private _instructions?: string;

   public name: string;
   public label: string;
   public model: AIModels;

   constructor(setup: AIAgentSetup, aiChat?: AICoreChat) {
      const {
         apiKey,
         name,
         label = name,
         model = defaultModel,
         instructions,
         handoffDescription,
         handoffOutputTypeWarningEnabled = true,
         handoffs,
         inputGuardrails,
         mcpServers,
         modelSettings,
         outputGuardrails,
         outputType,
         resetToolChoice = false,
         tools = [],
         toolUseBehavior
      } = setup || {};

      if (!name || !name.trim().length || typeof name !== 'string') {
         throw new ErrorAICore(`It's required to provide a valid name to create an AI Agent!`, 'ERROR_INVALID_AGENT_NAME');
      }

      if (apiKey && (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY !== apiKey)) {
         process.env.OPENAI_API_KEY = apiKey;
      }

      this.name = name;
      this.label = label;
      this.model = model;
      
      // Private
      this._aiChat = aiChat;
      this._history = new AIHistory();
      this._instructions = instructions;
      this._agent = new Agent<TContext>({
         name,
         model,
         instructions: this.fullInstructions,
         handoffDescription,
         handoffOutputTypeWarningEnabled,
         handoffs,
         inputGuardrails,
         mcpServers,
         modelSettings,
         outputGuardrails,
         outputType,
         resetToolChoice,
         tools,
         toolUseBehavior
      });
   }

   public get aiChat(): AICoreChat | undefined {
      return this._aiChat;
   }

   public get agent(): Agent<TContext> {
      return this._agent;
   }

   public get history(): AIHistoryItem[] {
      return Array.from(this._history.values());
   }

   public get instructions() {
      return this._instructions;
   }

   public get fullInstructions() {
      return [this.aiChat?.instructions, this.instructions].filter(Boolean).join('\n\n');
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

   public turn(setup?: AIAgentTurnSetup): AIAgentTurn {
      return new AIAgentTurn(setup, this);
   }
}
