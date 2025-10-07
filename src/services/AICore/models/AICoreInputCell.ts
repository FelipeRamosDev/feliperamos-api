import { ResponseInputFile, ResponseInputImage, ResponseInputItem, ResponseInputText } from 'openai/resources/responses/responses';
import { AICoreInputCellSetup, CellMessageContent, CellRole } from '../AICore.types';
import AICoreResult from '../models/AICoreResult';
import ErrorAICore from '../ErrorAICore';
import AICoreHelpers from '../AICoreHelpers';
import AIChatResult from '../models/AIChatResult';
import AIAgentResult from '../models/AIAgentResult';
import { AgentInputItem } from '@openai/agents';
import AgentInputItemModel from './AgentInputItemModel';
import ResponseInputItemModel from './ResponseInputItemModel';

export default class AICoreInputCell {
   public id?: string;
   public type?: string;
   public role: CellRole;
   public content: CellMessageContent;

   constructor(aiResult: AIAgentResult | AIChatResult | AICoreResult, setup: AICoreInputCellSetup) {
      const { id, type = 'message', role, textContent, content = [] } = setup || {};

      if (!aiResult) {
         throw new ErrorAICore(`It's required to provide a valid "parent" AICoreResult instance to create a new AICoreInputCell instance!`);
      }

      this.id = id;
      this.type = type;
      this.role = role;
      this.content = content;

      if (typeof textContent === 'string' && textContent.trim().length > 0) {
         this.addText(textContent);
      }
   }

   toAgentInputItem(): AgentInputItem {
      return new AgentInputItemModel(this.role, this.content).toAgentInputItem();
   }
   
   toResponseInputItem(): ResponseInputItem {
      return new ResponseInputItemModel(this.role, this.content as CellMessageContent).toResponseInputItem();
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

   async attachFileData(filePath: string): Promise<AICoreInputCell> {
      if (!filePath || typeof filePath !== 'string' || filePath.trim().length === 0) {
         throw new ErrorAICore('Invalid file path provided to attachFileData method.', 'AICORE_INPUT_CELL_INVALID_FILE_PATH');
      }

      try {
         const fileData = await AICoreHelpers.loadBase64String(filePath);
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

   async attachImage(imageUrl: string, detail: ResponseInputImage['detail'] = 'auto'): Promise<void> {
      if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
         throw new ErrorAICore('Invalid image URL provided to attachImage method.', 'AICORE_INPUT_CELL_INVALID_IMAGE_URL');
      }

      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
         const imageContent: ResponseInputImage = {
            type: 'input_image',
            image_url: imageUrl,
            detail
         };

         this.content.push(imageContent);
      } else {
         try {
            const image64URL = await AICoreHelpers.loadBase64String(imageUrl);
            const imageContent: ResponseInputImage = {
               type: 'input_image',
               image_url: image64URL,
               detail
            };

            this.content.push(imageContent);
         } catch (error: any) {
            throw new ErrorAICore(error.message || `Failed to read image file from path: ${imageUrl}.`, error.code || 'AICORE_INPUT_CELL_IMAGE_READ_ERROR');
         }
      }
   }
}
