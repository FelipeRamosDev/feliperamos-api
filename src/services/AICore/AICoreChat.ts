import OpenAI from 'openai';
import { ModelSettings } from '@openai/agents';
import AICore from './AICore';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import { AIAgentSetup, AICoreChatOptions, AIModels } from './AICore.types';
import AIChatTurn from './models/AIChatTurn';
import AIHistory from './models/AIHistory';
import AIHistoryItem from './models/AIHistoryItem';
import AIAgent from './AIAgent';
import AgentStore from './models/AgentStore';

export default class AICoreChat {
   private _aiCore: AICore;
   private _options: AICoreChatOptions;
   private _history: AIHistory;
   private _agents: AgentStore;
   private _isInit: boolean;
   private _instructions: string;
   private _instructionsFile?: string;
   private _instructionsPath?: string;

   public id?: string;
   public label?: string;
   public model: AIModels;
   public modelSettings?: ModelSettings;

   constructor(aiCore: AICore, options: AICoreChatOptions) {
      this._aiCore = aiCore;
      this._options = options;
      this._history = new AIHistory();
      this._agents = new AgentStore();
      this._isInit = false;

      const { id, label, model, modelSettings, instructions = '', instructionsFile, instructionsPath, history = [], agents = [] } = this._options || {};

      this.id = id || crypto.randomUUID();
      this.label = label;
      this.model = model || this._aiCore.model;
      this.modelSettings = modelSettings || this._aiCore.modelSettings;

      this._instructions = instructions || '';
      this._instructionsFile = instructionsFile;

      if (instructionsPath) {
         this._instructionsPath = instructionsPath;
         this._instructionsFile = AICoreHelpers.loadMarkdown(instructionsPath);
      }

      this.setHistoryBulk(history);
      this.setAgentBulk(agents);
   }

   get aiCore(): AICore {
      return this._aiCore;
   }

   get client(): OpenAI {
      return this.aiCore?.client;
   }

   get history(): AIHistoryItem[] {
      return Array.from(this._history.values());
   }

   get agents(): AIAgent[] {
      return Array.from(this._agents.values());
   }

   get isInit(): boolean {
      return Boolean(this._isInit);
   }

   get instructions(): string {
      return [this.aiCore?.instructions || '', this._instructions, this._instructionsFile].filter(Boolean).join('\n\n');
   }

   get instructionsFile(): string | undefined {
      return this._instructionsFile;
   }

   get instructionsPath(): string | undefined {
      return this._instructionsPath;
   }

   get setHistoryItem() {
      return this._history.setItem.bind(this._history);
   }

   get setHistoryBulk() {
      return this._history.setBulk.bind(this._history);
   }

   get getHistoryItem() {
      return this._history.getItem.bind(this._history);
   }

   toObject() {
      return {
         id: this.id,
         label: this.label,
         model: this.model,
         instructions: this.instructions,
         isInit: this.isInit
      };
   }

   response(model: AIModels = this.model, systemPrompt?: string): AIChatTurn {
      return new AIChatTurn({ model, systemPrompt }, this);
   }

   getAgent(name: string): AIAgent | undefined {
      return this._agents.getAgent(name);
   }

   setAgent<TContext, TOutput>(agentSetup: AIAgentSetup<TContext, TOutput> | AIAgent<TContext>): AIAgent<TContext> {
      const agent = agentSetup instanceof AIAgent
         ? agentSetup
         : new AIAgent<TContext, TOutput>(agentSetup, this);

      agent.setChat(this);
      this._agents.setAgent(agent);
      return agent;
   }

   setAgentBulk<TContext, TOutput>(agents: (AIAgentSetup<TContext, TOutput> | AIAgent<TContext, TOutput>)[] = []): AIAgent<TContext, TOutput>[] {
      return agents.map(agentSetup => this.setAgent<TContext, TOutput>(agentSetup));
   }

   close() {
      this.aiCore.endChat(this.id!);
   }

   static buildChatOptions(options: AICoreChatOptions): AICoreChatOptions {
      if (typeof options.label !== 'string') {
         throw new ErrorAICore(`Chat options must include a valid label.`, 'AICORE_INVALID_CHAT_OPTIONS_LABEL');
      }

      return options;
   }
}
