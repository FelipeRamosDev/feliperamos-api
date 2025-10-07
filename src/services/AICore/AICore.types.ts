import { MicroserviceSetup } from '../Microservice/Microservice.types';
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
   ResponseOutputMessage,
   ResponsePrompt,
   ResponseStreamEvent
} from 'openai/resources/responses/responses';
import { Agent, Handoff, InputGuardrail, MCPServer, ModelSettings, OutputGuardrail, RunContext, Tool, ToolUseBehavior } from '@openai/agents';

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

export interface AIChatTurnSetup extends AICoreResultSetup {
}

export interface AIAgentTurnSetup extends AICoreResultSetup {
}

export interface AICoreChatOptions {
   id?: number;
   label?: string;
   model?: AIModels;
   instructions?: string;
   smPath?: string;
   history?: (ResponseOutputMessage | AICoreInputCell)[];
}

export interface AICoreCellSetup {
   role: CellRole;
   textContent?: string;
   content?: CellMessageContent;
}

export interface AICoreInputCellSetup extends AICoreCellSetup {
   textContent?: string;
}

export interface AICoreOutputCellSetup extends AICoreCellSetup {
   
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
   label?: string;
   model?: AIModels;
   instructions?: string;
   handoffDescription?: string;
   handoffOutputTypeWarningEnabled?: boolean;
   handoffs?: (Agent<any, any> | Handoff<any, "text">)[];
   inputGuardrails?: InputGuardrail[];
   mcpServers?: MCPServer[];
   modelSettings?: ModelSettings;
   outputGuardrails?: OutputGuardrail<"text">[];
   outputType?: "text";
   prompt?: ((runContext: RunContext, agent: Agent<any, "text">) => Promise<ResponsePrompt> | ResponsePrompt);
   resetToolChoice?: boolean;
   tools?: Tool<any>[];
   toolUseBehavior?: ToolUseBehavior;
}

export type AIAgentOutputContent = string | CellMessageContent | Array<{
   type: 'output_text' | 'refusal' | 'audio' | 'image';
   text?: string;
   refusal?: string;
   audio?: string | { id: string };
   image?: string;
   format?: string | null;
   transcript?: string | null;
}>;
