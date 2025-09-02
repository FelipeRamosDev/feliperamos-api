import TableRow from '../../../../services/Database/models/TableRow';
import { LetterSetup } from './Letter.types';

export default class Letter extends TableRow {
   public subject: string;
   public body: string;
   public from_id: number;
   public to_id: number;

   constructor (setup: LetterSetup) {
      super('letters_schema', 'letters', setup);

      const {
         subject,
         body,
         from_id,
         to_id
      } = setup || {};

      if (!subject || !body || !from_id || !to_id) {
         throw new Error('Missing required fields to create a Letter! Required params: subject, body, from_id, to_id');
      }

      this.subject = subject;
      this.body = body;
      this.from_id = from_id;
      this.to_id = to_id;
   }
}
