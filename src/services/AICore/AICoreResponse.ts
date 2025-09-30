import { AICoreResponseStreamCallbacks, AIModels, CellRole } from './AICore.types';
import AICoreOutputCell from './models/AICoreOutputCell';
import AICoreChat from './AICoreChat';
import ErrorAICore from './ErrorAICore';
import AICoreInputCell from './models/AICoreInputCell';
import { ResponseCreateParamsNonStreaming, ResponseCreateParamsStreaming, ResponseOutputItem, ResponseOutputMessage } from 'openai/resources/responses/responses';
import AIChatHistoryItem from './models/AIChatHistoryItem';

export default class AICoreResponse {
   private _aiChat: AICoreChat;
   private _model: AIModels;
   private _systemPrompt?: string;
   private _options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming;
   private _input: AICoreInputCell[];

   constructor (aiChat: AICoreChat, model: AIModels, systemPrompt?: string) {
      if (!aiChat || !(aiChat instanceof AICoreChat)) {
         throw new ErrorAICore('Invalid AICoreChat instance provided to AICoreResponse.', 'AICORE_CHAT_RESPONSE_INVALID_AICHAT');
      }

      this._aiChat = aiChat;
      this._model = model || this.aiChat.model;
      this._systemPrompt = [this.aiChat.systemPrompt, systemPrompt].filter(s => typeof s === 'string' && s.trim().length > 0).join('\n') || undefined;
      this._options = { model: this._model, instructions: this._systemPrompt, input: [] };
      this._input = [];
   }

   public get aiChat(): AICoreChat {
      return this._aiChat;
   }

   public get input(): Partial<AICoreInputCell>[] {
      return this._input.map(cell => cell.toObject());
   }

   public get chatHistory(): Partial<AIChatHistoryItem>[] {
      return this._aiChat.history.map(item => item.toObject());
   }

   options(options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming): AICoreResponse {
      this._options = { ...this._options, ...options };
      return this;
   }

   model(model: AIModels): AICoreResponse {
      if (!model || typeof model !== 'string' || model.trim().length === 0) {
         return this;
      }

      this._model = model;
      return this;
   }

   systemPrompt(systemPrompt: string): AICoreResponse {
      if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim().length === 0) {
         return this;
      }

      this._systemPrompt = systemPrompt;
      return this;
   }

   addCell(role: CellRole, textContent?: string): AICoreInputCell {
      if (!role || typeof role !== 'string' || role.trim().length === 0) {
         throw new ErrorAICore('Invalid role provided to addCell method. Role must be "user", "assistant", "developer", or "system".', 'AICORE_CHAT_RESPONSE_INVALID_CELL_ROLE');
      }

      const cell = new AICoreInputCell(this, {
         role,
         textContent
      });

      this._input.push(cell);
      return cell;
   }

   private _buildOptions() {
      return { ...this._options, input: [...this.chatHistory, ...this._input.map(cell => cell.toObject())] };
   }

   pushInputToHistory(responseId: string) {
      this.input.forEach(cell => {
         this.aiChat.newHistoryItem(new AICoreInputCell(this, {
            id: responseId,
            type: cell.type,
            role: cell.role as CellRole,
            content: cell.content
         }));
      });
   }

   pushOutputToHistory(outputCells: ResponseOutputItem[]) {
      outputCells
         .filter(cell => cell.type === 'message')
         .forEach(cell => {
            this.aiChat.newHistoryItem(new AICoreOutputCell(this.aiChat, { ...cell, id: cell.id }));
         });
   }

   async create() {
      try {
         const options = this._buildOptions();
         const response = await this.aiChat.client.responses.create(options as ResponseCreateParamsNonStreaming);

         this.pushInputToHistory(response.id);

         response.output
            .filter(cell => cell.type === 'message')
            .map(cell => (
               this.aiChat.newHistoryItem(
                  new AICoreOutputCell(this.aiChat, { 
                     ...cell, 
                     id: cell.id 
                  })
               )
            ));

         return response;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to create AI chat response.`, error.code || 'AICORE_CHAT_RESPONSE_CREATE_ERROR');
      }
   }

   async stream(callbacks?: AICoreResponseStreamCallbacks) {
      const { onEvent, onCreated, onInProgress, onComplete, onOutputTextDelta, onError } = callbacks || {};

      try {
         const options = this._buildOptions();
         const stream = this.aiChat.client.responses.stream(options as ResponseCreateParamsStreaming);

         stream.on('response.created', ({ response }) => {
            this.pushInputToHistory(response.id);
            onCreated?.(arguments[0]);
         });

         onInProgress && stream.on('response.in_progress', (data) => {
            onInProgress(data);
         });

         onOutputTextDelta && stream.on('response.output_text.delta', (chunk) => {
            onOutputTextDelta(chunk);
         });

         stream.on('response.completed', ({ response }) => {
            this.pushOutputToHistory(response.output);
            onComplete?.(arguments[0]);
         });

         onError && stream.on('error', (error) => {
            onError(error);
         });

         onEvent && stream.on('event', (event) => {
            onEvent(event);
         });

         return stream;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to create AI chat response stream.`, error.code || 'AICORE_CHAT_RESPONSE_STREAM_ERROR');
      }
   }
}
