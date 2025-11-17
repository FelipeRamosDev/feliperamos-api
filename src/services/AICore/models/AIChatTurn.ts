import { ResponseCreateParamsNonStreaming, ResponseCreateParamsStreaming, ResponseOutputMessage } from 'openai/resources/responses/responses';
import { AIChatTurnSetup, AICoreResponseStreamCallbacks } from '../AICore.types';
import AICoreChat from '../AICoreChat';
import AICoreTurn from './AICoreTurn';
import ErrorAICore from '../ErrorAICore';
import AIHistoryItem from './AIHistoryItem';

export default class AIChatTurn extends AICoreTurn {
   private _aiChat?: AICoreChat;
   private _options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming;

   constructor (setup: AIChatTurnSetup, aiChat?: AICoreChat) {
      super(setup, aiChat);
      const { model } = setup || {};

      this._aiChat = aiChat;
      this.setModel(model || this.aiChat?.model);
      this._options = { model: this.model, instructions: this.instructions, input: [] };

      this.parentInstructions = this.aiChat?.instructions;
   }

   private get aiChat(): AICoreChat | undefined {
      return this._aiChat;
   }

   public get chatHistory(): AIHistoryItem[] {
      return this.aiChat?.history || [];
   }

   options(options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming): AIChatTurn {
      this._options = { ...this._options, ...options };
      return this;
   }

   buildOptions() {
      return { ...this._options, input: [...this.chatHistory, ...this.input].map(item => item.toResponseInputItem()) };
   }

   public async create() {
      try {
         const options = this.buildOptions();
         this.aiChat?.setHistoryBulk(this.input);

         const response = await this.aiChat?.client.responses.create(options as ResponseCreateParamsNonStreaming);
         if (!response) {
            throw new ErrorAICore('No response received from AI service.', 'AICORE_CHAT_RESPONSE_NO_RESPONSE');
         }

         this.aiChat?.setHistoryBulk(response.output as ResponseOutputMessage[]);
         return response;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to create AI chat response.`, 'AICORE_CHAT_RESPONSE_CREATE_ERROR');
      }
   }

   async stream(callbacks?: AICoreResponseStreamCallbacks) {
      const { onEvent, onCreated, onInProgress, onComplete, onOutputTextDelta, onError } = callbacks || {};

      if (!this.aiChat) {
         throw new ErrorAICore('AIChatTurn is not associated with any AICoreChat instance.', 'AICORE_CHAT_RESPONSE_NO_CHAT');
      }

      try {
         const options = this.buildOptions();
         const stream = this.aiChat.client.responses.stream(options as ResponseCreateParamsStreaming);
         
         this.aiChat?.setHistoryBulk(this.input);
         stream.on('response.created', () => {
            onCreated?.(arguments[0]);
         });

         onInProgress && stream.on('response.in_progress', (data) => {
            onInProgress(data);
         });

         onOutputTextDelta && stream.on('response.output_text.delta', (chunk) => {
            onOutputTextDelta(chunk);
         });

         stream.on('response.completed', ({ response }) => {
            this.aiChat?.setHistoryBulk(response.output as ResponseOutputMessage[]);
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
         throw new ErrorAICore(error.message || `Failed to create AI chat response stream.`, 'AICORE_CHAT_RESPONSE_STREAM_ERROR');
      }
   }
}
