import { CellRole } from '../AICore.types';
import type { ResponseOutputMessage, ResponseOutputRefusal, ResponseOutputText } from 'openai/resources/responses/responses';

export default class AICoreOutputCell {
   public id: string;
   public status: string;
   public type: string;
   public role: CellRole;
   public content: (ResponseOutputText | ResponseOutputRefusal)[];

   constructor(setup: ResponseOutputMessage) {
      const { role, content, id, status, type } = setup || {};

      this.id = id;
      this.status = status;
      this.type = type;
      this.role = role;
      this.content = content;
   }
}
