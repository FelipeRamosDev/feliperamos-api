import { AllModels } from 'openai/src/resources.js';
import { MicroserviceSetup } from '../Microservice/Microservice.types';
import AICoreOutputCell from './models/AICoreOutputCell';
import { ResponseInputAudio, ResponseInputFile, ResponseInputImage, ResponseInputText } from 'openai/resources/responses/responses.mjs';
import type { OpenAI } from 'openai';

export type AIModels = AllModels;
export type CellRole = 'user' | 'assistant' | 'system' | 'developer';
export type CellMessageContent = (ResponseInputText | ResponseInputImage | ResponseInputFile | ResponseInputAudio)[];
export type OpenAIResponseType = Awaited<ReturnType<OpenAI['responses']['create']>>;

export interface AICoreSetup extends MicroserviceSetup {
   apiKey?: string;
   model?: AIModels;
}

export interface AICoreChatOptions {
   id?: number;
   label?: string;
   model?: AIModels;
   systemMessage?: string;
   smPath?: string;
   history?: AICoreOutputCell[];
}

export interface AICoreCellSetup {
   role: CellRole;
   textContent?: string;
   content?: CellMessageContent;
}

export interface AICoreInputCellSetup {
   role: CellRole;
   textContent?: string;
   content?: CellMessageContent;
}
