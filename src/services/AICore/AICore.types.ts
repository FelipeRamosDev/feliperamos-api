import { MicroserviceSetup } from '../Microservice/Microservice.types';
import AICoreOutputCell from './models/AICoreOutputCell';
import type { OpenAI, OpenAIError } from 'openai';
import AICoreInputCell from './models/AICoreInputCell';
import { ResponseTextDeltaEvent } from 'openai/lib/responses/EventTypes';
import { AllModels } from 'openai/resources';
import {
   ResponseCompletedEvent,
   ResponseCreatedEvent,
   ResponseErrorEvent,
   ResponseInProgressEvent,
   ResponseInputAudio,
   ResponseInputFile,
   ResponseInputImage,
   ResponseInputText,
   ResponseStreamEvent
} from 'openai/resources/responses/responses';
import { AgentInputItem } from 'node_modules/@openai/agents-core/dist/types/aliases';

export type AIModels = AllModels;
export type CellRole = 'user' | 'assistant' | 'system';
export type CellMessageContent = (ResponseInputText | ResponseInputImage | ResponseInputFile | ResponseInputAudio)[];
export type OpenAIResponseType = Awaited<ReturnType<OpenAI['responses']['create']>>;

export interface AICoreSetup extends MicroserviceSetup {
   apiKey?: string;
   model?: AIModels;
}

export interface AICoreResultSetup {
   model?: AIModels;
   systemPrompt?: string;
}

export interface AIChatResultSetup extends AICoreResultSetup {
}

export interface AIAgentResultSetup extends AICoreResultSetup {
}

export interface AICoreChatOptions {
   id?: number;
   system_type: string;
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

export interface AIAgentSetup {
   apiKey?: string;
   name: string;
   model?: AIModels;
   instructions?: string;
}
