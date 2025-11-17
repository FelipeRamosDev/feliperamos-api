import type { AgentInputItem } from '@openai/agents';
import { CellMessageContent, CellRole } from '../AICore.types';

export default class AgentInputItemModel {
   public role: 'user' | 'assistant';
   public content: string | Array<{
      type: 'input_text' | 'input_image' | 'input_file' | 'input_audio';
      [key: string]: any;
   }>;

   constructor(role: CellRole, content: CellMessageContent) {
      this.role = role as 'user' | 'assistant';
      
      // Convert content to match AgentInputItem format
      if (Array.isArray(content)) {
         this.content = content.map(item => {
            if (item.type === 'input_text') return { type: 'input_text', text: item.text };
            if (item.type === 'input_image') return { type: 'input_image', image_url: item.image_url, detail: item.detail };
            if (item.type === 'input_file') return { type: 'input_file', file_id: item.file_id, file_data: item.file_data };
            if (item.type === 'input_audio') return { type: 'input_audio', audio: item.input_audio };

            return item;
         });
      } else {
         this.content = content as string;
      }
   }

   // Type assertion method to ensure compatibility
   toAgentInputItem(): AgentInputItem {
      return this as unknown as AgentInputItem;
   }
}