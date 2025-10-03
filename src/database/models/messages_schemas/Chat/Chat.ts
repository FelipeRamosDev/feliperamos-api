import TableRow from '../../../../services/Database/models/TableRow';
import { ChatSetup } from './Chat.types';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import database from '../../../../database';
import { defaultSystemType } from '../../../../app.config';

export default class Chat extends TableRow {
   public system_type: string;
   public instructions?: string;
   public label?: string;
   public model?: string;

   constructor(setup: ChatSetup) {
      super('messages_schemas', 'chats', setup);
      const { system_type = defaultSystemType, instructions, label, model } = setup;

      this.system_type = system_type;
      this.instructions = instructions;
      this.label = label;
      this.model = model;
   }

   getAIChat() {
      return new Promise((resolve, reject) => {
         service.sendTo('/ai/get-chat', { chatid: this.id }, (response) => {
            if (response.error) {
               return reject(response);
            }

            resolve(response);
         });
      });
   }

   static async create(setup: ChatSetup) {
      try {
         const { data = [], error } = await database.insert('messages_schema', 'chats').data(setup).returning().exec();
         const [ chatData ] = data;

         if (error) {
            throw new ErrorDatabase('Unknown error occurred while creating Chat instance', 'ERROR_CREATING_CHAT_INSTANCE');
         }

         if (!chatData) {
            throw new ErrorDatabase('No data returned from the database when creating Chat instance', 'NO_DATA_RETURNED_CREATING_CHAT_INSTANCE');
         }

         return new Chat(chatData);
      } catch (error: any) {
         throw new ErrorDatabase(error.message || 'Error creating Chat instance on the database', error.code || 'ERROR_CREATING_CHAT_INSTANCE');
      }
   }
}
