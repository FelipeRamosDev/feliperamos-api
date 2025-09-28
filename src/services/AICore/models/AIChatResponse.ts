import { AIModels, CellRole } from '../AICore.types';
import AICoreOutputCell from './AICoreOutputCell';
import AICoreChat from '../AICoreChat';
import ErrorAICore from '../ErrorAICore';
import AICoreInputCell from './AICoreInputCell';
import { ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses.mjs';

export default class AIChatResponse {
   private _aiChat: AICoreChat;
   private _model: AIModels;
   private _systemPrompt?: string
   private _options: ResponseCreateParamsNonStreaming;
   private _input: AICoreInputCell[];

   constructor (aiChat: AICoreChat, model: AIModels, systemPrompt?: string) {
      if (!aiChat || !(aiChat instanceof AICoreChat)) {
         throw new ErrorAICore('Invalid AICoreChat instance provided to AIChatResponse.', 'AICORE_CHAT_RESPONSE_INVALID_AICHAT');
      }

      this._aiChat = aiChat;
      this._model = model || this._aiChat.model;
      this._systemPrompt = `${this._aiChat.systemPrompt}\n${systemPrompt}`.trim() || undefined;
      this._options = { model: this._model, instructions: this._systemPrompt, input: [] };
      this._input = [];
   }

   public get aiChat(): AICoreChat {
      return this._aiChat;
   }

   public get input(): Partial<AICoreInputCell>[] {
      return this._input.map(cell => cell.toObject());
   }

   public get chatHistory(): (AICoreOutputCell | AICoreInputCell)[] {
      return this._aiChat.history;
   }

   options(options: ResponseCreateParamsNonStreaming): AIChatResponse {
      this._options = { ...this._options, ...options };
      return this;
   }

   model(model: AIModels): AIChatResponse {
      if (!model || typeof model !== 'string' || model.trim().length === 0) {
         return this;
      }

      this._model = model;
      return this;
   }

   systemPrompt(systemPrompt: string): AIChatResponse {
      if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim().length === 0) {
         return this;
      }

      this._systemPrompt = systemPrompt;
      return this;
   }

   addCell(role: CellRole, textContent?: string): AICoreInputCell {
      if (!role || typeof role !== 'string' || role.trim().length === 0) {
         throw new ErrorAICore('Invalid role provided to addCell method. Role must be "user", "assistant", or "system".', 'AICORE_CHAT_RESPONSE_INVALID_CELL_ROLE');
      }

      const cell = new AICoreInputCell(this, { role, textContent });
      this._input.push(cell);
      return cell;
   }

   private _buildOptions() {
      return { ...this._options, input: [...this.chatHistory, ...this._input.map(cell => cell.toObject())] };
   }

   async create() {
      try {
         const options = this._buildOptions();
         const response = await this.aiChat.client.responses.create(options as ResponseCreateParamsNonStreaming);

         this.aiChat.toHistory('assistant', response);
         return response;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to create AI chat response.`, error.code || 'AICORE_CHAT_RESPONSE_CREATE_ERROR');
      }
   }
}
