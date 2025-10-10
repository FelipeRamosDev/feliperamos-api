import { ResponseOutputMessage } from 'openai/resources/responses/responses.js';
import ErrorAICore from '../ErrorAICore';
import AgentOutputItemModel from './AgentOutputItemModel';
import AICoreInputCell from './AICoreInputCell';
import AIHistoryItem from './AIHistoryItem';

export default class AIHistory<TContext = any> extends Map<string, AIHistoryItem<TContext>> {
   constructor() {
      super();
   }

   getItem(id: string): AIHistoryItem<TContext> | undefined {
      return this.get(id);
   }

   setItem(value: AICoreInputCell<TContext> | ResponseOutputMessage | AgentOutputItemModel): AIHistoryItem<TContext> {
      try {
         const newItem = new AIHistoryItem<TContext>(value);
   
         this.set(newItem.id, newItem);
         return newItem;
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'An unknown error occurred while adding item to AIHistory.', 'ERROR_AI_HISTORY_ADD_ITEM');   
      }
   }

   setBulk(items: (AICoreInputCell<TContext> | ResponseOutputMessage | AgentOutputItemModel)[] = []): void {
      try {
         items.forEach((item) => this.setItem(item));
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'An unknown error occurred while adding Bulk items to AIHistory.', 'ERROR_AI_HISTORY_ADD_BULK');
      }
   }
}
