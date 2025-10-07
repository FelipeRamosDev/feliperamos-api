import OpenAI from 'openai';
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
   private _stored?: () => Chat;
   private _isInit: boolean;

   public id?: number;
   public label?: string;
   public model: AIModels;
   public instructions?: string;

   constructor(aiCore: AICore, options: AICoreChatOptions) {
      const { id } = options;

      this._aiCore = aiCore;
      this._options = options;
      this._history = new AIHistory();
      this._agents = new AgentStore();

      const { label, model, instructions, smPath, history = [] } = this._options || {};
      const smLoaded = smPath ? AICoreHelpers.loadMarkdown(smPath) : '';
      const textSM = smLoaded || instructions;

      this.id = id;
      this.label = label;
      this.model = model || this._aiCore.model;
      this._isInit = false;

      this.setHistoryBulk(history);

      if (textSM) {
         this.instructions = textSM;
      }
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

   public get stored(): Chat | undefined {
      return this._stored?.();
   }

   public get isInit(): boolean {
      return Boolean(this._isInit);
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
         this._stored = () => createdChat;

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

   public setAgent(agentSetup: AIAgentSetup) {
      const agent = new AIAgent(agentSetup, this);

      this._agents.setAgent(agent);
      return agent;      
   }
}
