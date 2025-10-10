import { AgentInputItem } from '@openai/agents';
import { AIAgentOutputContent, CellMessageContent, CellRole } from '../AICore.types';
import ErrorAICore from '../ErrorAICore';
import AgentInputItemModel from './AgentInputItemModel';
import AgentOutputItemModel from './AgentOutputItemModel';
import AICoreInputCell from './AICoreInputCell';
import { ResponseInputItem, ResponseOutputMessage } from 'openai/resources/responses/responses.js';
import ResponseInputItemModel from './ResponseInputItemModel';

export default class AIHistoryItem<TContext = any> {
   public id: string;
   public createdAt: string;
   public role: CellRole;
   public content: CellMessageContent | AIAgentOutputContent[];

   constructor(setup: AICoreInputCell<TContext> | ResponseOutputMessage | AgentOutputItemModel) {
      const { id, role, content } = setup || {};
      const createdAt = new Date();

      if (!role || typeof role !== 'string' || !role.trim().length) {
         throw new ErrorAICore(`Invalid role provided to create AIHistoryItem instance. Role must be "user", "assistant", "developer", or "system".`, 'ERROR_INVALID_HISTORY_ITEM_ROLE');
      }

      if (!content || !Array.isArray(content) || !content.length) {
         throw new ErrorAICore(`Invalid content provided to create AIHistoryItem instance. Content must be a non-empty array of CellMessageContent items.`, 'ERROR_INVALID_HISTORY_ITEM_CONTENT');
      }

      this.createdAt = createdAt.toJSON();
      this.id = id || `${role}_${createdAt.getTime()}`;

      if (role === 'user' || role === 'system') {
         this.role = role;
         this.content = content as CellMessageContent;
      } else {
         this.role = 'assistant';
         this.content = content as CellMessageContent;
      }
   }

   toAgentInputItem(): AgentInputItem {
      return new AgentInputItemModel(this.role, this.content as CellMessageContent).toAgentInputItem();
   }

   toResponseInputItem(): ResponseInputItem {
      return new ResponseInputItemModel(this.role, this.content as CellMessageContent).toResponseInputItem();
   }
}
