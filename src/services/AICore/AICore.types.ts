import { AllModels } from 'openai/src/resources.js';
import { MicroserviceSetup } from '../Microservice/Microservice.types';
import AICoreOutputCell from './models/AICoreOutputCell';
import { ResponseCompletedEvent, ResponseCreatedEvent, ResponseErrorEvent, ResponseInProgressEvent, ResponseInputAudio, ResponseInputFile, ResponseInputImage, ResponseInputText, ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import type { OpenAI, OpenAIError } from 'openai';
import AICoreInputCell from './models/AICoreInputCell';
import { ResponseTextDeltaEvent } from 'openai/lib/responses/EventTypes.mjs';

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
   history?: (AICoreOutputCell | AICoreInputCell)[];
}

export interface AICoreCellSetup {
   role: CellRole;
   textContent?: string;
   content?: CellMessageContent;
}

export interface AICoreInputCellSetup extends AICoreCellSetup {
   textContent?: string;
}

export interface AICoreCellSetup {
   id?: string;
   type?: string;
   role: CellRole;
   content?: CellMessageContent;
}

export interface AICoreResponseStreamCallbacks {
   onEvent?: (event: ResponseStreamEvent) => void;
   onCreated?: (response: ResponseCreatedEvent) => void;
   onInProgress?: (response: ResponseInProgressEvent) => void;
   onError?: (error: ResponseErrorEvent | OpenAIError) => void;
   onComplete?: (event: ResponseCompletedEvent) => void;
   onOutputTextDelta?: (event: ResponseTextDeltaEvent) => void;
}
