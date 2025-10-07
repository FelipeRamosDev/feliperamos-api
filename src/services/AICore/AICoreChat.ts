import OpenAI from 'openai';
import AICore from './AICore';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import { AICoreChatOptions, AIModels } from './AICore.types';
import { Chat } from '../../database/models/messages_schemas';
import { defaultSystemType } from '../../app.config';
import AIChatResult from './models/AIChatResult';
import AIHistory from './models/AIHistory';
import AIHistoryItem from './models/AIHistoryItem';

export default class AICoreChat {
   private _aiCore: AICore;
   private _options: AICoreChatOptions;
   private _history: AIHistory;
   private _stored?: () => Chat;

   public id?: number;
   public system_type: string;
   public label?: string;
   public model: AIModels;
   public systemPrompt?: string;
   public isInitialized: boolean;

   constructor(aiCore: AICore, options: AICoreChatOptions) {
      const { id } = options;

      this._aiCore = aiCore;
      this._options = options;
      this._history = new AIHistory();

      const { label, system_type = defaultSystemType, model, systemMessage, smPath, history = [] } = this._options || {};
      const smLoaded = smPath ? AICoreHelpers.loadMarkdown(smPath) : '';
      const textSM = smLoaded || systemMessage;

      this.id = id;
      this.system_type = system_type;
      this.label = label;
      this.model = model || this._aiCore.model;
      this.isInitialized = false;

      this.setHistoryBulk(history);

      if (textSM) {
         this.systemPrompt = textSM;
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

   public get stored(): Chat | undefined {
      return this._stored?.();
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
         system_type: this.system_type,
         model: this.model,
         systemPrompt: this.systemPrompt,
         isInitialized: this.isInitialized
      };
   }

   public async start() {
      try {
         const createdChat = await Chat.create({
            label: this.label,
            system_type: this.system_type,
            model: this.model,
            instructions: this.systemPrompt,
         });

         this.id = createdChat.id;
         this._stored = () => createdChat;

         this.isInitialized = true;
         this.aiCore.setChat(this);

         return this;
      } catch (error) {
         throw new ErrorAICore(`Failed to initialize AICoreChat with id "${this.id}".`, 'AICORE_CHAT_INIT_ERROR');
      }
   }

   public response(model: AIModels = this.model, systemPrompt?: string): AIChatResult {
      return new AIChatResult({ model, systemPrompt }, this);
   }
}
