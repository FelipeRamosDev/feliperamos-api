import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import { LetterSetup, LetterTypes } from './Letter.types';
import database from '../../../../database';
import { Company } from '../../companies_schema';
import { Opportunity } from '../../opportunities_schema';
import { AdminUser } from '../../users_schema';
import { defaultLocale } from '../../../../app.config';
import path from 'path';

export default class Letter extends TableRow {
   public language_set?: string;
   public type: LetterTypes;
   public subject: string;
   public body: string;
   public from_id: number;
   public from?: Partial<AdminUser>;
   public from_name?: string;
   public company_id: number;
   public company_name?: string;
   public opportunity_id: number;
   public job_title?: string;
   public company?: Company;
   public opportunity?: Opportunity;

   constructor (setup: LetterSetup) {
      super('letters_schema', 'letters', setup);

      const {
         type,
         subject,
         body,
         from_id,
         from_name,
         from,
         company_id,
         company_name,
         opportunity_id,
         job_title
      } = setup || {};

      if (subject == null || body == null || from_id == null || company_id == null || opportunity_id == null) {
         throw new Error('Missing required fields to create a Letter! Required params: type, subject, body, from_id, company_id, opportunity_id');
      }

      this.type = type;
      this.subject = subject;
      this.body = body;
      this.from_id = from_id;
      this.company_id = company_id;
      this.company_name = company_name;
      this.opportunity_id = opportunity_id;
      this.job_title = job_title;
      this.from_name = from_name;
      
      if (from) {
         this.from = new AdminUser(from);
      }
   }

   get toSave() {
      return {
         type: this.type,
         subject: this.subject,
         body: this.body,
         from_id: this.from_id,
         company_id: this.company_id,
         opportunity_id: this.opportunity_id,
      };
   }

   get pdfPath() {
      // Construct the sender's name for the path
      let senderName = 'unknown_user';

      if (this.from) {
         const first = this.from.first_name || '';
         const last = this.from.last_name || '';
         if (first || last) {
            senderName = `${first} ${last}`.trim();
         }
      } else if (this.from_name) {
         senderName = this.from_name;
      }

      senderName = senderName.replace(/ /g, '_');
      const relativePath = `letter/${senderName}_cover_letter_${this.id}_${this?.language_set || defaultLocale}.pdf`;
      return path.join(process.env.PUBLIC_PATH || '', relativePath);
   }

   async populateCompany() {
      try {
         const { data = [], error } = await database.select('companies_schema', 'companies').where({ id: this.company_id }).exec();
         const [ company ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to populate company for Letter!', 'FAILED_TO_POPULATE_LETTER_COMPANY');
         }

         if (company) {
            this.company_name = company.company_name;
            this.company = new Company(company);
         }
      } catch (error) {
         throw new ErrorDatabase('Failed to populate company for Letter!', 'FAILED_TO_POPULATE_LETTER_COMPANY');
      }
   }

   async populateOpportunity() {
      try {
         const { data = [], error } = await database.select('opportunities_schema', 'opportunities').where({ id: this.opportunity_id }).exec();
         const [ opportunity ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to populate opportunity for Letter!', 'FAILED_TO_POPULATE_LETTER_OPPORTUNITY');
         }

         if (opportunity) {
            this.job_title = opportunity.job_title;
            this.opportunity = new Opportunity(opportunity);
         }
      } catch (error) {
         throw new ErrorDatabase('Failed to populate opportunity for Letter!', 'FAILED_TO_POPULATE_LETTER_OPPORTUNITY');
      }
   }

   async populateUser() {
      try {
         const { data = [], error } = await database.select('users_schema', 'admin_users').where({ id: this.from_id }).exec();
         const [ user ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to populate user for Letter!', 'FAILED_TO_POPULATE_LETTER_USER');
         }

         if (user) {
            this.from = new AdminUser(user).toPublic();
         }
      } catch (error) {
         throw new ErrorDatabase('Failed to populate user for Letter!', 'FAILED_TO_POPULATE_LETTER_USER');
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

   static async find(query: Partial<LetterSetup> = {}): Promise<Letter[]> {
      try {
         const queryBuilder = database.select('letters_schema', 'letters').where(query);

         queryBuilder.populate('company_id', ['letters.id', 'company_name']);
         queryBuilder.populate('opportunity_id', ['letters.id', 'job_title']);
         queryBuilder.populate('from_id', ['letters.id', 'first_name', 'last_name', 'email']);
         queryBuilder.sort({ created_at: 'DESC' });

         const { data = [], error } = await queryBuilder.exec();

         if (error) {
            throw new ErrorDatabase('Failed to fetch Letters from database!', 'FAILED_TO_FETCH_LETTERS');
         }

         return data.map(item => new Letter({
            ...item,
            company_name: item.company_name,
            from_name: `${item.first_name} ${item.last_name}`,
         }));
      } catch (error: any) {
         throw new ErrorDatabase(error.message || 'Failed to fetch Letters from database!', error.code || 'FAILED_TO_FETCH_LETTERS');
      }
   }

   static async findById(id: number): Promise<Letter | null> {
      try {
         if (!id || isNaN(Number(id))) {
            throw new ErrorDatabase('Invalid Letter ID for findById!', 'INVALID_LETTER_ID');
         }

         const { data = [], error } = await database.select('letters_schema', 'letters').where({ id }).exec();
         const [ letter ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to fetch Letter from database!', 'FAILED_TO_FETCH_LETTER');
         }

         if (!letter) {
            return null;
         }

         const letterDoc = new Letter(letter);

         await letterDoc.populateCompany();
         await letterDoc.populateOpportunity();
         await letterDoc.populateUser();

         return letterDoc;
      } catch (error) {
         throw new ErrorDatabase('Failed to fetch Letter from database!', 'FAILED_TO_FETCH_LETTER');
      }
   }

   static async update(id: number, data: Partial<LetterSetup>): Promise<Letter> {
      try {
         if (!id || isNaN(Number(id))) {
            throw new ErrorDatabase('Invalid Letter ID for update!', 'INVALID_LETTER_ID');
         }

         const { data: updatedData = [], error } = await database.update('letters_schema', 'letters').set(data).where({ id }).returning().exec();
         const [ updated ] = updatedData;
         const letter = new Letter(updated);

         if (error) {
            throw new ErrorDatabase('Failed to update Letter in database!', 'FAILED_TO_UPDATE_LETTER');
         }

         if (!updated) {
            throw new ErrorDatabase('Letter not found for update!', 'LETTER_NOT_FOUND');
         }

         await letter.populateCompany();
         await letter.populateOpportunity();

         return letter;
      } catch (error) {
         throw new ErrorDatabase('Failed to update Letter in database!', 'FAILED_TO_UPDATE_LETTER');
      }
   }
}
