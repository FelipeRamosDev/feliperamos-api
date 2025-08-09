import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import { EducationSetCreate, EducationSetSetup } from './EducationSet.types';
import database from '../../../../database';

class EducationSet extends TableRow {
   public degree?: string;
   public field_of_study?: string;
   public grade?: string;
   public description?: string;
   public education_id: number;
   public language_set: string;
   public user_id: number;

   constructor(setup: EducationSetSetup, schemaName: string = 'educations_schema', tableName: string = 'education_sets') {
      super(schemaName, tableName, setup);
      const { degree, field_of_study, grade, description, education_id, user_id, language_set } = setup || {};

      this.degree = degree;
      this.field_of_study = field_of_study;
      this.grade = grade;
      this.description = description;
      this.education_id = education_id;
      this.user_id = user_id;
      this.language_set = language_set;
   }

   toObjectSet() {
      return {
         id: this.id,
         created_at: this.created_at,
         updated_at: this.updated_at,
         degree: this.degree,
         field_of_study: this.field_of_study,
         grade: this.grade,
         description: this.description,
         education_id: this.education_id,
         user_id: this.user_id,
         language_set: this.language_set
      }
   }

   static async create(values: EducationSetCreate): Promise<EducationSet> {
      try {
         const { data = [], error } = await database.insert('educations_schema', 'education_sets').data(values).returning().exec();
         const [ created ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to create education set', 'ERR_CREATE_FAILED', 'Database Error');
         }

         if (!created) {
            throw new ErrorDatabase('Failed to create education set', 'ERR_CREATE_FAILED', 'Database Error');
         }

         return new EducationSet(created);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_CREATE_FAILED');
      }
   }

   static async updateSet(id: number, updates: Partial<EducationSetSetup>): Promise<EducationSet | null> {
      try {
         const { data = [], error } = await database.update('educations_schema', 'education_sets').set(updates).where({ id }).returning().exec();
         const [ updated ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to update education set', 'ERR_UPDATE_FAILED', 'Database Error');
         }

         if (!updated) {
            return null;
         }

         return new EducationSet(updated);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_UPDATE_FAILED');
      }
   }
}

export default EducationSet;
