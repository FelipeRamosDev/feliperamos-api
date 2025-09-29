import Microservice from '../Microservice/Microservice';
import { AICoreChatOptions, AICoreSetup, AIModels } from './AICore.types';
import OpenAI from 'openai';
import AICoreChat from './AICoreChat';
import ErrorAICore from './ErrorAICore';

export default class AICore extends Microservice {
   private _client: OpenAI;
   private _apiKey?: string;
   private _chats: Map<number, AICoreChat>;

   public model: AIModels;

   constructor(setup: AICoreSetup = {}) {
      super(setup);
      const { apiKey, model = 'gpt-4.1-mini' } = setup;

      this._apiKey = apiKey;
      this._client = new OpenAI({ apiKey });
      this._chats = new Map<number, AICoreChat>();

      this.model = model;
   }

   public get client(): OpenAI {
      return this._client;
   }

   public get apiKey(): string | undefined {
      return this._apiKey;
   }

   getChat(id: number): AICoreChat | undefined {
      return this._chats.get(id);
   }

   setChat(chat: AICoreChat): void {
      if (!(chat instanceof AICoreChat)) {
         throw new ErrorAICore(`The provided chat must be an instance of AICoreChat.`, 'AICORE_INVALID_CHAT_INSTANCE');
      }

      if (!chat.id) {
         throw new ErrorAICore(`The provided chat must have a valid id.`, 'AICORE_INVALID_CHAT_ID');
      }

      this._chats.set(chat.id, chat);
   }

   async startChat(options: AICoreChatOptions): Promise<AICoreChat> {
      const chat = new AICoreChat(this, options);

      try {
         await chat.start();

         this.setChat(chat);
         return chat;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to start chat with id "${chat.id}".`, error.code || 'AICORE_START_CHAT_ERROR');
      }
   }
}
