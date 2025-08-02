import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import { CVSetSetup } from './CVSet.types';
import database from '../../../../database';
import { AdminUser } from '../../users_schema';
import { AdminUserPublic } from '../../users_schema/AdminUser/AdminUser.types';
import { defaultLocale } from '../../../../app.config';

export default class CVSet extends TableRow {
   public user_id?: number | null;
   public job_title?: string;
   public summary?: string;
   public cv_id?: number;
   public language_set: string;
   public user: AdminUser | AdminUserPublic;

   constructor(setup: CVSetSetup, schemaName: string = 'curriculums_schema', tableName: string = 'cv_sets') {
      super(schemaName, tableName, setup);

      const {
         job_title = '',
         summary = '',
         user_id,
         cv_id,
         language_set = defaultLocale
      } = setup || {};
      
      this.cv_id = cv_id;
      this.language_set = language_set;
      this.job_title = job_title;
      this.summary = summary;
      this.user_id = user_id;
      this.user = new AdminUser(setup);
   }

   static async createSet(setup: CVSetSetup): Promise<CVSet> {
      const { cv_id, user_id, job_title, summary, language_set } = setup || {};

      try {
         const { data = [], error } = await database.insert('curriculums_schema', 'cv_sets').data({
            cv_id,
            user_id,
            job_title,
            summary,
            language_set
         }).returning().exec();
         const [ createdSet ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to create CV Set', 'CV_SET_CREATE_ERROR');
         }

         if (!createdSet) {
            throw new ErrorDatabase('No CV Set created', 'CV_SET_CREATE_NO_DATA');
         }

         return new CVSet(createdSet);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code);
      }
   }

   static async updateSet(id: number, updates: Partial<CVSetSetup>): Promise<CVSet | null> {
      try {
         const query = database.update('curriculums_schema', 'cv_sets');

         query.set(updates);
         query.where({ id });
         query.returning();

         const { data = [], error } = await query.exec();

         if (error) {
            throw new ErrorDatabase('Failed to update CV Set', 'CV_SET_UPDATE_ERROR');
         }

         const [ updatedSet ] = data;

         if (!updatedSet) {
            throw new ErrorDatabase('No CV Set found with the provided ID after update', 'CV_SET_NOT_FOUND');
         }

         return new CVSet(updatedSet);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code);
      }
   }
}
