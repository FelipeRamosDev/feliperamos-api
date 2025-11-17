import OpenAI from 'openai';
import { ModelSettings } from '@openai/agents';
import AICore from './AICore';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import { AIAgentSetup, AICoreChatOptions, AIModels } from './AICore.types';
import { Chat } from '../../database/models/messages_schemas';
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

   public id?: number;
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

      this.id = id;
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

   public get aiCore(): AICore {
      return this._aiCore;
   }

   public get client(): OpenAI {
      return this.aiCore?.client;
   }

   public get history(): AIHistoryItem[] {
      return Array.from(this._history.values());
   }

   public get agents(): AIAgent[] {
      return Array.from(this._agents.values());
   }

   public get isInit(): boolean {
      return Boolean(this._isInit);
   }

   public get instructions(): string {
      return [this._instructions, this._instructionsFile].filter(Boolean).join('\n---\n');
   }

   public get instructionsFile(): string | undefined {
      return this._instructionsFile;
   }

   public get instructionsPath(): string | undefined {
      return this._instructionsPath;
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

   public toObject() {
      return {
         id: this.id,
         label: this.label,
         model: this.model,
         instructions: this.instructions,
         isInit: this.isInit
      };
   }

   public async start() {
      try {
         const createdChat = await Chat.create({
            label: this.label,
            model: this.model,
            instructions: this.instructions,
         });

         this.id = createdChat.id;

         this._isInit = true;
         this.aiCore.setChat(this);

         return this;
      } catch (error) {
         throw new ErrorAICore(`Failed to initialize AICoreChat with id "${this.id}".`, 'AICORE_CHAT_INIT_ERROR');
      }
   }

   public response(model: AIModels = this.model, systemPrompt?: string): AIChatTurn {
      return new AIChatTurn({ model, systemPrompt }, this);
   }

   public getAgent(name: string): AIAgent | undefined {
      return this._agents.getAgent(name);
   }

   public setAgent<TContext, TOutput>(agentSetup: AIAgentSetup<TContext, TOutput> | AIAgent<TContext>): AIAgent<TContext> {
      const agent = agentSetup instanceof AIAgent
         ? agentSetup
         : new AIAgent<TContext, TOutput>(agentSetup, this);

      agent.setChat(this);
      this._agents.setAgent(agent);
      return agent;
   }

   public setAgentBulk<TContext, TOutput>(agents: (AIAgentSetup<TContext, TOutput> | AIAgent<TContext, TOutput>)[] = []): AIAgent<TContext, TOutput>[] {
      return agents.map(agentSetup => this.setAgent<TContext, TOutput>(agentSetup));
   }
}
