import OpenAI from 'openai';
import AICore from './AICore';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import AICoreOutputCell from './models/AICoreOutputCell';
import AICoreInputCell from './models/AICoreInputCell';
import AIChatHistoryItem from './models/AIChatHistoryItem';
import { AICoreChatOptions, AIModels } from './AICore.types';
import { Chat } from '../../database/models/messages_schemas';
import { defaultSystemType } from '../../app.config';
import AIChatResult from './AIChatResult';

export default class AICoreChat {
   private _aiCore: AICore;
   private _options: AICoreChatOptions;
   private _history: Map<string, AIChatHistoryItem>;
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
      this._history = new Map<string, AIChatHistoryItem>();

      const { label, system_type = defaultSystemType, model, systemMessage, smPath, history = [] } = this._options || {};
      const smLoaded = smPath ? AICoreHelpers.loadMarkdown(smPath) : '';
      const textSM = smLoaded || systemMessage;

      this.id = id;
      this.system_type = system_type;
      this.label = label;
      this.model = model || this._aiCore.model;
      this.isInitialized = false;

      history.forEach(cell => cell.id && this._history.set(cell.id, new AIChatHistoryItem(cell)));

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

   public get history(): AIChatHistoryItem[] {
      return Array.from(this._history.values());
   }

   public get stored(): Chat | undefined {
      return this._stored?.();
   }
   
   toObject() {
      return {
         id: this.id,
         label: this.label,
         system_type: this.system_type,
         model: this.model,
         systemPrompt: this.systemPrompt,
         isInitialized: this.isInitialized
      };
   }

   async start() {
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

   response(model: AIModels = this.model, systemPrompt?: string): AIChatResult {
      return new AIChatResult({ model, systemPrompt }, this);
   }

   getHistoryItem(id: string): AIChatHistoryItem | null {
      const item = this._history.get(id);

      if (!item) {
         return null;
      }

      return item;
   }

   setHistoryItem(item: AIChatHistoryItem): AIChatHistoryItem | null {
      if (!item || !(item instanceof AIChatHistoryItem) || !item.id) {
         throw new ErrorAICore('Invalid AIChatHistoryItem provided to setHistoryItem.', 'AICORE_CHAT_SET_HISTORY_INVALID_ITEM');
      }

      this._history.set(item.id, item);
      return this.getHistoryItem(item.id);
   }

   newHistoryItem(cell: AICoreOutputCell | AICoreInputCell): void {
      if (!cell || !(cell instanceof AICoreOutputCell || cell instanceof AICoreInputCell)) {
         throw new ErrorAICore('Invalid cell provided to newHistoryItem method.', 'AICORE_CHAT_NEW_HISTORY_INVALID_CELL');
      }

      const item = new AIChatHistoryItem(cell);
      if (!item?.id) {
         return;
      }

      this._history.set(item.id, item);
   }

   delHistory(id: string): boolean {
      return this._history.delete(id);
   }
}
