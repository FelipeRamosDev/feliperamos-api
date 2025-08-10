import database from '../../../../database';
import EducationSet from '../EducationSet/EducationSet';
import { EducationSetup } from './Education.types';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { defaultLocale, locales } from '../../../../app.config';

class Education extends EducationSet {
   public institution_name: string;
   public start_date: Date;
   public end_date: Date;
   public is_current: boolean;
   public student_id: number;
   public languageSets: EducationSet[];

   static populateFields = [
      'educations.id',
      'institution_name',
      'start_date',
      'end_date',
      'is_current',
      'student_id'
   ];

   constructor(setup: EducationSetup) {
      super(setup, 'educations_schema', 'educations');
      const { institution_name, start_date, end_date, is_current, student_id } = setup || {};

      this.institution_name = institution_name;
      this.start_date = start_date;
      this.end_date = end_date;
      this.is_current = Boolean(is_current);
      this.languageSets = [];

      if (student_id != null && student_id !== undefined) {
         this.student_id = student_id;
      } else if (this.user_id != null && this.user_id !== undefined) {
         this.student_id = this.user_id;
      } else {
         throw new ErrorDatabase('Param "student_id" is required and was not provided.', 'ERR_MISSING_STUDENT_ID');
      }
   }

   toObject() {
      return {
         id: this.id,
         created_at: this.created_at,
         updated_at: this.updated_at,
         institution_name: this.institution_name,
         start_date: this.start_date,
         end_date: this.end_date,
         is_current: this.is_current,
         student_id: this.student_id
      }
   }

   toCreate() {
      const result = this.toObject();

      delete result.id;
      delete result.created_at;
      delete result.updated_at;

      return result;
   }

   async save() {
      const toAbort = [];

      try {
         const { data = [], error } = await database.insert(this.schemaName, this.tableName).data(this.toCreate()).returning().exec();
         const [ created ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to save education', 'ERR_SAVE_FAILED', 'Database Error');
         }

         if (!created) {
            throw new ErrorDatabase('Failed to save education', 'ERR_SAVE_FAILED', 'Database Error');
         }

         toAbort.push(database.delete(this.schemaName, this.tableName).where({ id: created.id }));

         const defaultSet = await EducationSet.create({
            education_id: created.id,
            language_set: defaultLocale,
            user_id: this.user_id,
            degree: this.degree,
            field_of_study: this.field_of_study,
            grade: this.grade,
            description: this.description
         });

         if (!defaultSet) {
            throw new ErrorDatabase('Failed to create default education set', 'ERR_CREATE_SET_FAILED');
         }

         toAbort.push(database.delete(this.schemaName, 'education_sets').where({ id: defaultSet.id }));
         for (const locale of locales) {
            if (locale === defaultLocale) {
               continue;
            }

            const createdSet = await EducationSet.create({
               education_id: created.id,
               language_set: locale,
               user_id: this.user_id
            });

            if (!createdSet) {
               throw new ErrorDatabase(`Failed to create education set for locale ${locale}`, 'ERR_CREATE_SET_FAILED');
            }

            toAbort.push(database.delete(this.schemaName, 'education_sets').where({ id: createdSet.id }));
         }

         return new Education({ ...defaultSet.toObjectSet(), ...created });
      } catch (error: any) {
         toAbort.forEach(item => item.exec().catch((err) => console.error(err)));
         throw new ErrorDatabase(error.message, error.code || 'ERR_SAVE_FAILED', 'Database Error');
      }
   }

   async loadLanguageSets(): Promise<this> {
      try {
         const query = database.select('educations_schema', 'education_sets');
         query.where({ education_id: this.id });

         const { data = [], error } = await query.exec();

         if (error) {
            throw new ErrorDatabase('Failed to find education', 'ERR_FIND_FAILED');
         }

         this.languageSets = data.map(item => new EducationSet(item));
         return this;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_FIND_FAILED');
      }
   }

   static async findById(id: number, language_set: string = defaultLocale): Promise<Education | null> {
      try {
         const query = database.select('educations_schema', 'education_sets');

         query.where({ education_id: id, language_set });
         query.populate('education_id', this.populateFields);

         const { data = [], error } = await query.exec();
         const [ education ] = data;
   
         if (error) {
            throw new ErrorDatabase('Failed to find education', 'ERR_FIND_FAILED');
         }
   
         if (!education) {
            return null;
         }
   
         return new Education(education);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_FIND_FAILED');
      }
   }

   static async getManyById(education_ids: number[], language_set: string = defaultLocale): Promise<Education[]> {
      try {
         const query = database.select('educations_schema', 'education_sets');
         query.where(education_ids.map(id => ({ education_id: id, language_set })));
         query.populate('education_id', this.populateFields);

         const { data = [], error } = await query.exec();

         if (error) {
            throw new ErrorDatabase('Failed to find educations', 'ERR_FIND_FAILED');
         }

         return data.map(item => new Education(item)).filter(education => education.language_set === language_set);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_FIND_FAILED');
      }
   }

   static async getFullById(id: number): Promise<Education | null> {
      try {
         const query = database.select('educations_schema', 'educations').where({ id });

         const { data = [], error } = await query.exec();
         const [ education ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to find education', 'ERR_FIND_FAILED');
         }

         if (!education) {
            return null;
         }

         const educationInstance = new Education(education);
         await educationInstance.loadLanguageSets();
         return educationInstance;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_FIND_FAILED');
      }
   }

   static async findByUserId(user_id: number, language_set: string = defaultLocale): Promise<Education[]> {
      try {
         const query = database.select('educations_schema', 'education_sets');

         query.where({ user_id, language_set });
         query.populate('education_id', this.populateFields);

         const { data = [], error } = await query.exec();

         if (error) {
            throw new ErrorDatabase('Failed to find educations', 'ERR_FIND_FAILED');
         }

         return data.map(item => new Education(item));
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_FIND_FAILED');
      }
   }

   static async update(education_id: number, updates: Partial<EducationSetup>): Promise<Education | null> {
      try {
         const { data = [], error } = await database.update('educations_schema', 'educations').set(updates).where({ id: education_id }).returning().exec();
         const [ updated ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to update education', 'ERR_UPDATE_FAILED');
         }

         if (!updated) {
            return null;
         }

         return new Education(updated);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_UPDATE_FAILED');
      }
   }

   static async delete(education_id: number): Promise<boolean> {
      try {
         const { error } = await database.delete('educations_schema', 'education_sets').where({ education_id }).returning().exec();

         if (error) {
            throw new ErrorDatabase('Failed to delete education', 'ERR_DELETE_FAILED', 'Database Error');
         }

         const { data = [], error: mainError } = await database.delete('educations_schema', 'educations').where({ id: education_id }).returning().exec();
         const [ deleted ] = data;

         if (mainError) {
            throw new ErrorDatabase('Failed to delete education', 'ERR_DELETE_FAILED', 'Database Error');
         }

         if (!deleted) {
            return false;
         }

         return true;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'ERR_DELETE_FAILED');
      }
   }
}

export default Education;
