import ErrorAICore from '../ErrorAICore';
import AgentOutputItemModel from './AgentOutputItemModel';
import AICoreInputCell from './AICoreInputCell';
import AICoreOutputCell from './AICoreOutputCell';
import AIHistoryItem from './AIHistoryItem';

export default class AIHistory extends Map<string, AIHistoryItem> {
   constructor() {
      super();
   }

   getItem(id: string): AIHistoryItem | undefined {
      return this.get(id);
   }

   setItem(value: AICoreInputCell | AICoreOutputCell | AgentOutputItemModel): AIHistoryItem {
      try {
         const newItem = new AIHistoryItem(value);
   
         this.set(newItem.id, newItem);
         return newItem;
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'An unknown error occurred while adding item to AIHistory.', 'ERROR_AI_HISTORY_ADD_ITEM');   
      }
   }

   setBulk(items: (AICoreInputCell | AICoreOutputCell | AgentOutputItemModel)[] = []): void {
      try {
         items.forEach((item) => this.setItem(item));
      } catch (error: any) {
         throw new ErrorAICore(error.message || 'An unknown error occurred while adding Bulk items to AIHistory.', 'ERROR_AI_HISTORY_ADD_BULK');
      }
   }
}
