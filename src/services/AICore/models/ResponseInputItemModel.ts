import { ResponseInputItem } from "openai/resources/responses/responses.js";
import { CellMessageContent, CellRole } from "../AICore.types";

export default class ResponseInputItemModel {
   public role: CellRole;
   public content: CellMessageContent;

   constructor(role: CellRole, content: CellMessageContent) {
      this.role = role;
      this.content = content;
   }

   toResponseInputItem(): ResponseInputItem {
      return { role: this.role, content: this.content };
   }
}
