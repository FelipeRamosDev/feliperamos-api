import { AgentInputItem } from '@openai/agents';
import { AIAgentOutputContent, CellMessageContent, CellRole } from '../AICore.types';
import ErrorAICore from '../ErrorAICore';
import AgentInputItemModel from './AgentInputItemModel';
import AgentOutputItemModel from './AgentOutputItemModel';
import AICoreInputCell from './AICoreInputCell';
import AICoreOutputCell from "./AICoreOutputCell";

export default class AIHistoryItem {
   public id: string;
   public createdAt: string;
   public role: CellRole;
   public content: CellMessageContent | AIAgentOutputContent[];

   constructor(setup: AICoreInputCell | AICoreOutputCell | AgentOutputItemModel) {
      const { id, role, content } = setup || {};

      if (!role || typeof role !== 'string' || !role.trim().length) {
         throw new ErrorAICore(`Invalid role provided to create AIHistoryItem instance. Role must be "user", "assistant", "developer", or "system".`, 'ERROR_INVALID_HISTORY_ITEM_ROLE');
      }

      if (!content || !Array.isArray(content) || !content.length) {
         throw new ErrorAICore(`Invalid content provided to create AIHistoryItem instance. Content must be a non-empty array of CellMessageContent items.`, 'ERROR_INVALID_HISTORY_ITEM_CONTENT');
      }

      this.createdAt = new Date().toJSON();
      this.id = id || `user-${this.createdAt}`;

      if (role === 'user' || role === 'system') {
         this.role = role;
         this.content = content as CellMessageContent;
      } else {
         this.role = 'assistant';
         this.content = content as CellMessageContent;
      }
   }

   public get textOutput(): string {
      if (this.role !== 'assistant') return '';

      return '';
   }

   toAgentInputItem(): AgentInputItem {
      return new AgentInputItemModel(this.role, this.content as CellMessageContent).toAgentInputItem();
   }
}
