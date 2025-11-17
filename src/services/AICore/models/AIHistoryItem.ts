import { AgentInputItem } from '@openai/agents';
import { AgentFunctionCall, AIAgentOutputContent, CellMessageContent, CellRole } from '../AICore.types';
import ErrorAICore from '../ErrorAICore';
import AgentInputItemModel from './AgentInputItemModel';
import AgentOutputItemModel from './AgentOutputItemModel';
import AICoreInputCell from './AICoreInputCell';
import { ResponseInputItem, ResponseOutputMessage } from 'openai/resources/responses/responses';
import ResponseInputItemModel from './ResponseInputItemModel';

export default class AIHistoryItem<TContext = any> {
   public id: string;
   public createdAt: string;
   public role: CellRole;
   public content?: CellMessageContent | AIAgentOutputContent[];
   public type?: 'message' | 'function_call';
   public callId?: string;
   public name?: string;
   public providerData?: Record<string, any>;
   public status?: 'in_progress' | 'completed' | 'incomplete';
   public arguments?: Record<string, any>;
   public isToolCall?: boolean;

   constructor(setup: AICoreInputCell<TContext> | ResponseOutputMessage | AgentOutputItemModel | AgentFunctionCall) {
      const { id, type } = setup || {};
      const createdAt = new Date();

      this.createdAt = createdAt.toJSON();

      if (type === 'function_call' || type === 'function_call_result') {
         const { callId, name, providerData, status } = setup as AgentFunctionCall || {};

         this.isToolCall = true;
         this.id = id || `${type}_${createdAt.getTime()}`;
         this.callId = callId;
         this.name = name;
         this.providerData = providerData;
         this.status = status;
         this.arguments = JSON.parse((setup as AgentFunctionCall).arguments || '{}');
         this.role = 'assistant';

         return;
      }

      const { role, content } = setup as AICoreInputCell<TContext> | ResponseOutputMessage | AgentOutputItemModel || {};
      if (!role || typeof role !== 'string' || !role.trim().length) {
         throw new ErrorAICore(`Invalid role provided to create AIHistoryItem instance. Role must be "user", "assistant", "developer", or "system".`, 'ERROR_INVALID_HISTORY_ITEM_ROLE');
      }

      if (!content || !Array.isArray(content) || !content.length) {
         throw new ErrorAICore(`Invalid content provided to create AIHistoryItem instance. Content must be a non-empty array of CellMessageContent items.`, 'ERROR_INVALID_HISTORY_ITEM_CONTENT');
      }

      this.id = id || `${role}_${createdAt.getTime()}`;

      if (role === 'user' || role === 'system') {
         this.role = role;
      } else {
         this.role = 'assistant';
      }

      this.content = content as CellMessageContent;
   }

   toAgentInputItem(): AgentInputItem {
      return new AgentInputItemModel(this.role, this.content as CellMessageContent).toAgentInputItem();
   }

   toResponseInputItem(): ResponseInputItem {
      return new ResponseInputItemModel(this.role, this.content as CellMessageContent).toResponseInputItem();
   }
}
