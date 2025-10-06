import { ResponseCreateParamsNonStreaming, ResponseCreateParamsStreaming, ResponseOutputItem } from 'openai/resources/responses/responses';
import { AIChatResultSetup, AICoreResponseStreamCallbacks, CellRole } from './AICore.types';
import AICoreChat from './AICoreChat';
import AICoreResult from './AICoreResult';
import AIChatHistoryItem from './models/AIChatHistoryItem';
import ErrorAICore from './ErrorAICore';
import AICoreOutputCell from './models/AICoreOutputCell';
import AICoreInputCell from './models/AICoreInputCell';

export default class AIChatResult extends AICoreResult {
   private _aiChat?: AICoreChat;
   private _options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming;

   constructor (setup: AIChatResultSetup, aiChat?: AICoreChat) {
      super(setup);
      const { model } = setup || {};

      this._aiChat = aiChat;
      this.setModel(model || this.aiChat?.model);
      this._options = { model: this.model, instructions: this.instructions, input: [] };

      this.parentInstructions = this.aiChat?.systemPrompt;
   }

   private get aiChat(): AICoreChat | undefined {
      return this._aiChat;
   }

   public get chatHistory(): Partial<AIChatHistoryItem>[] {
      return this._aiChat?.history.map(item => item.toObject()) || [];
   }

   options(options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming): AIChatResult {
      this._options = { ...this._options, ...options };
      return this;
   }

   buildOptions() {
      return { ...this._options, input: [...this.chatHistory, ...this.input] };
   }

   pushInputToHistory(responseId: string) {
      if (!this.aiChat) return;

      this.input.forEach(cell => {
         this.aiChat?.newHistoryItem(new AICoreInputCell(this, {
            id: responseId,
            type: cell.type,
            role: cell.role as CellRole,
            content: cell.content
         }));
      });
   }

   pushOutputToHistory(outputCells: ResponseOutputItem[]) {
      if (!this.aiChat) return;

      outputCells
         .filter(cell => cell.type === 'message')
         .forEach(cell => {
            this.aiChat?.newHistoryItem(new AICoreOutputCell(this.aiChat, { ...cell, id: cell.id }));
         });
   }

   public async create() {
      try {
         const options = this.buildOptions();
         const response = await this.aiChat?.client.responses.create(options as ResponseCreateParamsNonStreaming);

         if (!response) {
            throw new ErrorAICore('No response received from AI service.', 'AICORE_CHAT_RESPONSE_NO_RESPONSE');
         }

         this.pushInputToHistory(response?.id);

         response?.output
            .filter(cell => cell.type === 'message')
            .map(cell => (
               this.aiChat?.newHistoryItem(
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

      if (!this.aiChat) {
         throw new ErrorAICore('AIChatResult is not associated with any AICoreChat instance.', 'AICORE_CHAT_RESPONSE_NO_CHAT');
      }

      try {
         const options = this.buildOptions();
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
