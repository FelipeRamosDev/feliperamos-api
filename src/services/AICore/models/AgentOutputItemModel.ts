import type { AgentOutputItem } from '@openai/agents';
import { AIAgentOutputContent } from '../AICore.types';

export default class AgentOutputItemModel {
   public role: 'assistant';
   public status: 'in_progress' | 'completed' | 'incomplete';
   public content: AIAgentOutputContent;
   public id?: string;
   public type?: 'message';

   constructor(
      content: AIAgentOutputContent,
      status: 'in_progress' | 'completed' | 'incomplete' = 'completed',
      options?: {
         id?: string;
         type?: 'message';
      }
   ) {
      this.role = 'assistant';
      this.status = status;
      this.content = content;
      this.id = options?.id;
      this.type = options?.type;
   }

   toAgentOutputItem(): AgentOutputItem {
      return {
         role: this.role,
         status: this.status,
         content: this.transformContent(),
         ...(this.id && { id: this.id }),
         ...(this.type && { type: this.type }),
      } as AgentOutputItem;
   }

   private transformContent(): Array<any> {
      if (typeof this.content === 'string') {
         return [{ type: 'output_text', text: this.content }];
      }

      if (!Array.isArray(this.content)) {
         return [{ type: 'output_text', text: String(this.content) }];
      }

      return this.content.map((item: any) => {
         // If item already has the correct output format
         if (item.type === 'output_text' || item.type === 'refusal' || item.type === 'audio' || item.type === 'image') {
            return item;
         }

         // Transform input types to output types
         switch (item.type) {
            case 'input_text':
               return { type: 'output_text', text: item.text };
            case 'input_image':
               return { type: 'image', image: item.image_url };
            case 'input_audio':
               return { 
                  type: 'audio', 
                  audio: item.input_audio
               };
            default:
               throw new Error(`Unsupported content type for output: ${item.type}`);
         }
      });
   }

   /**
    * Static factory method to create from text content
    */
   static fromText(text: string, status: 'in_progress' | 'completed' | 'incomplete' = 'completed'): AgentOutputItemModel {
      return new AgentOutputItemModel(text, status);
   }

   /**
    * Static factory method to create from array content
    */
   static fromContent(content: AIAgentOutputContent, status: 'in_progress' | 'completed' | 'incomplete' = 'completed'): AgentOutputItemModel {
      return new AgentOutputItemModel(content, status);
   }
}
