import OpenAI from 'openai';
import AICore from './AICore';
import { AICoreChatOptions, AIModels, CellRole } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';
import AICoreOutputCell from './models/AICoreOutputCell';
import type { Response as OpenAIResponse, ResponseOutputItem } from 'openai/resources/responses/responses.mjs';
import AIChatResponse from './models/AIChatResponse';
import AICoreInputCell from './models/AICoreInputCell';

export default class AICoreChat {
   private _aiCore: AICore;
   private _options: AICoreChatOptions;
   private _history: Map<string, AICoreOutputCell | AICoreInputCell>;

   public id?: number;
   public label?: string;
   public model: AIModels;
   public history: (AICoreOutputCell | AICoreInputCell)[];
   public systemPrompt?: string;
   public isInitialized: boolean;

   constructor(aiCore: AICore, options: AICoreChatOptions) {
      this._aiCore = aiCore;
      this._options = options;
      this._history = new Map<string, AICoreOutputCell | AICoreInputCell>();

      const { id, label, model, systemMessage, smPath, history = [] } = this._options || {};
      const smLoaded = smPath ? AICoreHelpers.loadMarkdown(smPath) : '';
      const textSM = smLoaded || systemMessage;

      this.id = id;
      this.label = label;
      this.model = model || this._aiCore.model;
      this.history = history;
      this.isInitialized = false;

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

   toHistory(role: CellRole, content: string | OpenAIResponse): void {
      if (role === 'assistant' && content && typeof content === 'object' && 'output' in content) {
         content.output.forEach((output) => {
            if (output.type === 'message') {
               this._history.set(output.id, new AICoreOutputCell(this, output));
            }
         });
      }

   }

   async start() {
      try {
         console.log(`AICoreChat with id "${this.id || 'new'}" and label "${this.label}" initialized successfully.`);
         this.isInitialized = true;
         this.id = Date.now();

         return this;
      } catch (error) {
         throw new ErrorAICore(`Failed to initialize AICoreChat with id "${this.id}".`, 'AICORE_CHAT_INIT_ERROR');
      }
   }

   response(model: AIModels = this.model, systemPrompt?: string): AIChatResponse {
      return new AIChatResponse(this, model, systemPrompt || this.systemPrompt);
   }
}
