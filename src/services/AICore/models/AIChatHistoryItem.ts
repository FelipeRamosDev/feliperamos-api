import { CellRole } from '../AICore.types';
import ErrorAICore from '../ErrorAICore';
import AICoreInputCell from './AICoreInputCell';
import AICoreOutputCell from './AICoreOutputCell';

export default class AIChatHistoryItem {
   public id?: string;
   public role: CellRole;
   public type?: AICoreOutputCell['type'];
   public content: AICoreOutputCell['content'] | AICoreInputCell['content'];

   constructor(cell: AICoreOutputCell | AICoreInputCell) {
      if (!cell || !(cell instanceof AICoreOutputCell || cell instanceof AICoreInputCell)) {
         throw new ErrorAICore('Invalid cell provided to AIChatHistoryItem.', 'AICORE_CHAT_HISTORY_ITEM_INVALID_CELL');
      }

      const { id, role, content, type = 'message' } = cell;

      this.id = id;
      this.type = type;
      this.role = role;
      this.content = content;
   }

   toObject() {
      return {
         role: this.role,
         content: this.content
      };
   }
}
