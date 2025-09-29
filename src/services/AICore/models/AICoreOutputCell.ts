import { CellRole } from '../AICore.types';
import type { ResponseOutputMessage, ResponseOutputRefusal, ResponseOutputText } from 'openai/resources/responses/responses.mjs';
import AICoreChat from '../AICoreChat';
import ErrorAICore from '../ErrorAICore';

export default class AICoreOutputCell {
   private _aiChat: AICoreChat;

   public id: string;
   public status: string;
   public type: string;
   public role: CellRole;
   public content: (ResponseOutputText | ResponseOutputRefusal)[];

   constructor(aiChat: AICoreChat, setup: ResponseOutputMessage) {
      const { role, content, id, status, type } = setup || {};

      if (!aiChat) {
         throw new ErrorAICore(`It's required to provide a valid "parent" AICoreChat instance to create a new AICoreOutputCell instance!`, 'AICORE_OUTPUT_CELL_INVALID_AICHAT');
      }

      this._aiChat = aiChat;

      this.id = id;
      this.status = status;
      this.type = type;
      this.role = role;
      this.content = content;
   }

   public get aiChat(): AICoreChat {
      return this._aiChat;
   }
}
