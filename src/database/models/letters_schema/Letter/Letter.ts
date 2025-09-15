import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import { LetterSetup } from './Letter.types';
import database from '../../../../database';

export default class Letter extends TableRow {
   public subject: string;
   public body: string;
   public from_id: number;
   public company_id: number;
   public opportunity_id: number;

   constructor (setup: LetterSetup) {
      super('letters_schema', 'letters', setup);

      const {
         subject,
         body,
         from_id,
         company_id,
         opportunity_id
      } = setup || {};

      if (subject == null || body == null || from_id == null || company_id == null || opportunity_id == null) {
         throw new Error('Missing required fields to create a Letter! Required params: subject, body, from_id, company_id, opportunity_id');
      }

      this.subject = subject;
      this.body = body;
      this.from_id = from_id;
      this.company_id = company_id;
      this.opportunity_id = opportunity_id;
   }

   get toSave() {
      return {
         subject: this.subject,
         body: this.body,
         from_id: this.from_id,
         company_id: this.company_id,
         opportunity_id: this.opportunity_id,
      }
   }

   async save() {
      try {
         const { data = [], error } = await database.insert(this.schemaName, this.tableName).data(this.toSave).returning().exec();
         const [ created ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to save Letter to database!', 'FAILED_TO_SAVE_LETTER');
         }

         return new Letter(created);
      } catch (error) {
         throw new ErrorDatabase('Failed to save Letter to database!', 'FAILED_TO_SAVE_LETTER');
      }
   }
}
