import { ResponseInputAudio, ResponseInputFile, ResponseInputImage, ResponseInputText } from 'openai/resources/responses/responses.mjs';
import { AICoreInputCellSetup, CellMessageContent, CellRole } from '../AICore.types';
import AICoreResponse from '../AICoreResponse';
import { readFileSync } from 'fs';
import path from 'path';
import ErrorAICore from '../ErrorAICore';

export default class AICoreInputCell {
   private _aiResponse: AICoreResponse;

   public id?: string;
   public type?: string;
   public role: CellRole;
   public content: CellMessageContent;

   constructor(aiResponse: AICoreResponse, setup: AICoreInputCellSetup) {
      const { id, type = 'message', role, textContent, content = [] } = setup || {};

      if (!aiResponse) {
         throw new ErrorAICore(`It's required to provide a valid "parent" AICoreResponse instance to create a new AICoreInputCell instance!`);
      }

      this._aiResponse = aiResponse;

      this.id = id;
      this.type = type;
      this.role = role;
      this.content = content;

      if (typeof textContent === 'string' && textContent.trim().length > 0) {
         this.addText(textContent);
      }
   }

   public get aiResponse(): AICoreResponse {
      return this._aiResponse;
   }

   toObject() {
      return {
         id: this.id,
         type: this.type,
         role: this.role,
         content: this.content
      };
   }

   addText(content: string): AICoreInputCell {
      const textContent: ResponseInputText = {
         text: content,
         type: 'input_text'
      };

      this.content.push(textContent);
      return this;
   }

   attachFileByID(fileId: string): AICoreInputCell {
      const fileContent: ResponseInputFile = {
         type: 'input_file',
         file_id: fileId,
      };

      this.content.push(fileContent);
      return this;
   }

   attachFileData(filePath: string): AICoreInputCell {
      if (!filePath || typeof filePath !== 'string' || filePath.trim().length === 0) {
         throw new ErrorAICore('Invalid file path provided to attachFileData method.', 'AICORE_INPUT_CELL_INVALID_FILE_PATH');
      }

      try {
         const projectRoot = process.cwd();
         const absolutePath = path.join(projectRoot, filePath);
         const fileData = readFileSync(absolutePath, 'base64');

         const fileContent: ResponseInputFile = {
            type: 'input_file',
            file_data: fileData,
         };

         this.content.push(fileContent);
         return this;
      } catch (error: any) {
         throw new ErrorAICore(error.message || `Failed to read file data from path: ${filePath}.`, error.code || 'AICORE_INPUT_CELL_FILE_READ_ERROR');
      }
   }
}

