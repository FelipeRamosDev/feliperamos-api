import OpenAI from 'openai';
import AICore from './AICore';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import AICoreOutputCell from './models/AICoreOutputCell';
import AICoreResponse from './AICoreResponse';
import AICoreInputCell from './models/AICoreInputCell';
import AIChatHistoryItem from './models/AIChatHistoryItem';
import { AICoreChatOptions, AIModels } from './AICore.types';

export default class AICoreChat {
   private _aiCore: AICore;
   private _options: AICoreChatOptions;
   private _history: Map<string, AIChatHistoryItem>;

   public id: number;
   public label?: string;
   public model: AIModels;
   public systemPrompt?: string;
   public isInitialized: boolean;

   constructor(aiCore: AICore, options: AICoreChatOptions) {
      this._aiCore = aiCore;
      this._options = options;
      this._history = new Map<string, AIChatHistoryItem>();

      const { id, label, model, systemMessage, smPath, history = [] } = this._options || {};
      const smLoaded = smPath ? AICoreHelpers.loadMarkdown(smPath) : '';
      const textSM = smLoaded || systemMessage;

      this.id = id || Date.now();
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

   response(model: AIModels = this.model, systemPrompt?: string): AICoreResponse {
      return new AICoreResponse(this, model, systemPrompt || this.systemPrompt);
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

   async start() {
      try {
         console.log(`AICoreChat with id "${this.id || 'new'}" and label "${this.label}" initialized successfully.`);
         this.isInitialized = true;
         this.id = this.history.length + 1;

         return this;
      } catch (error) {
         throw new ErrorAICore(`Failed to initialize AICoreChat with id "${this.id}".`, 'AICORE_CHAT_INIT_ERROR');
      }
   }
}
