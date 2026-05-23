import OpenAI from 'openai';
import { ModelSettings } from '@openai/agents';
import Microservice from '../Microservice/Microservice';
import { AICoreChatOptions, AICoreSetup, AIModels } from './AICore.types';
import AICoreChat from './AICoreChat';
import ErrorAICore from './ErrorAICore';
import AICoreHelpers from './AICoreHelpers';

export default class AICore extends Microservice {
   private _client: OpenAI;
   private _apiKey?: string;
   private _chats: Map<string, AICoreChat>;
   private _chatSets: Map<string, AICoreChatOptions>;
   private _instructions: string;
   private _instructionsFile?: string;
   private _instructionsPath?: string;

   public model: AIModels;
   public modelSettings?: ModelSettings;

   constructor(setup: AICoreSetup = {}) {
      super(setup);
      const { apiKey, model = 'gpt-4o', modelSettings, instructions, instructionsFile, instructionsPath } = setup;

      this._apiKey = apiKey;
      this._client = new OpenAI({ apiKey });
      this._chats = new Map<string, AICoreChat>();
      this._chatSets = new Map<string, AICoreChatOptions>();

      this.model = model;
      this.modelSettings = modelSettings;

      this._instructions = instructions || '';
      this._instructionsFile = instructionsFile;

      if (instructionsPath) {
         this._instructionsPath = instructionsPath;
         this._instructionsFile = AICoreHelpers.loadMarkdown(instructionsPath);
      }
   }

   public get client(): OpenAI {
      return this._client;
   }

   public get apiKey(): string | undefined {
      return this._apiKey;
   }
   
   get instructions(): string {
      return [this._instructions, this._instructionsFile].filter(Boolean).join('\n\n');
   }

   get instructionsFile(): string | undefined {
      return this._instructionsFile;
   }

   get instructionsPath(): string | undefined {
      return this._instructionsPath;
   }

   getChat(id: string): AICoreChat | undefined {
      return this._chats.get(id);
   }

   getChatOption(label: string): AICoreChatOptions | undefined {
      if (typeof label !== 'string') {
         throw new ErrorAICore(`Chat label must be provided to retrieve chat options.`, 'AICORE_MISSING_CHAT_LABEL');
      }

      return this._chatSets.get(label);
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

   setChatOptions(options: AICoreChatOptions): AICoreChatOptions {
      if (typeof options.label !== 'string') {
         throw new ErrorAICore(`Chat options must include a valid label.`, 'AICORE_INVALID_CHAT_OPTIONS_LABEL');
      }

      this._chatSets.set(options.label, options);
      return options;
   }

   startChat(label: string, id?: string): AICoreChat {
      const options = this.getChatOption(label);

      if (!options) {
         throw new ErrorAICore(`No chat options found for label "${label}".`, 'AICORE_CHAT_OPTIONS_NOT_FOUND');
      }

      try {
         const chat = new AICoreChat(this, { ...options, id });
         this.setChat(chat);
         return chat;
      } catch (error: any) {
         throw new ErrorAICore(error?.message || `Failed to start chat with label "${label}".`, error?.code || 'AICORE_START_CHAT_ERROR');
      }
   }

   endChat(id: string): void {
      const chat = this.getChat(id);

      if (!chat) {
         throw new ErrorAICore(`No chat found with ID "${id}".`, 'AICORE_CHAT_NOT_FOUND');
      }

      this._chats.delete(id);
   }
}
