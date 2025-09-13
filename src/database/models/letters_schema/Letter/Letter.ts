import TableRow from '../../../../services/Database/models/TableRow';
import { LetterSetup } from './Letter.types';

export default class Letter extends TableRow {
   public subject: string;
   public body: string;
   public from_id: number;
   public company_id: number;

   constructor (setup: LetterSetup) {
      super('letters_schema', 'letters', setup);

      const {
         subject,
         body,
         from_id,
         company_id
      } = setup || {};

      if (subject == null || body == null || from_id == null || company_id == null) {
         throw new Error('Missing required fields to create a Letter! Required params: subject, body, from_id, company_id');
      }

      this.subject = subject;
      this.body = body;
      this.from_id = from_id;
      this.company_id = company_id;
   }
}
