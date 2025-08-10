import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import database from '../../../../database';

import type {
   LanguageLevel,
   LanguageSetup
} from './Language.types';

class Language extends TableRow {
   public default_name: string;
   public local_name: string;
   public locale_code: string;
   public reading_level: LanguageLevel;
   public listening_level: LanguageLevel;
   public writing_level: LanguageLevel;
   public speaking_level: LanguageLevel;
   public language_user_id: number;

   static levels = [
      'beginner',
      'intermediate',
      'advanced',
      'proficient',
      'native'
   ];

   constructor (setup: LanguageSetup) {
      super('languages_schema', 'languages', setup);
      const { default_name, local_name, locale_code, reading_level, listening_level, writing_level, speaking_level, language_user_id } = setup || {};

      if (!default_name || !local_name || !locale_code || !reading_level || !listening_level || !writing_level || !speaking_level || !language_user_id) {
         throw new ErrorDatabase('All fields are required for Language', 'LANGUAGE_REQUIRED_FIELDS');
      }

      this.default_name = default_name;
      this.local_name = local_name;
      this.locale_code = locale_code;
      this.reading_level = reading_level;
      this.listening_level = listening_level;
      this.writing_level = writing_level;
      this.speaking_level = speaking_level;
      this.language_user_id = language_user_id;
   }

   public get level() {
      const readingScore = Language.levels.indexOf(this.reading_level) + 1;
      const listeningScore = Language.levels.indexOf(this.listening_level) + 1;
      const writingScore = Language.levels.indexOf(this.writing_level) + 1;
      const speakingScore = Language.levels.indexOf(this.speaking_level) + 1;

      const levelScore = (readingScore + listeningScore + writingScore + speakingScore) / 4;
      const idx = Math.max(0, Math.min(Language.levels.length - 1, Math.floor(levelScore) - 1));

      return Language.levels[idx];
   }

   toObject() {
      return {
         id: this.id,
         created_at: this.created_at,
         updated_at: this.updated_at,
         default_name: this.default_name,
         local_name: this.local_name,
         locale_code: this.locale_code,
         level: this.level,
         reading_level: this.reading_level,
         listening_level: this.listening_level,
         writing_level: this.writing_level,
         speaking_level: this.speaking_level,
         language_user_id: this.language_user_id
      };
   }

   toCreate() {
      const result = this.toObject();

      delete result.id;
      delete result.created_at;
      delete result.updated_at;

      return result;
   }

   async save(): Promise<Language | null> {
      try {
         const { data = [], error } = await database.insert(this.schemaName, this.tableName).data(this.toCreate()).returning().exec();
         const [ created ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to save Language', 'LANGUAGE_SAVE_FAILED');
         }

         if (!created) {
            throw new ErrorDatabase('Failed to create Language', 'LANGUAGE_CREATION_FAILED');
         }

         return new Language(created);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'LANGUAGE_SAVE_FAILED');
      }
   }

   static async findById(language_id: number): Promise<Language | null> {
      try {
         const { data = [], error } = await database.select('languages_schema', 'languages').where({ id: language_id }).exec();
         const [ found ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to find Language', 'LANGUAGE_FIND_FAILED');
         }

         if (!found) {
            return null;
         }

         return new Language(found);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'LANGUAGE_FIND_FAILED');
      }
   }

   static async getManyById(language_ids: number[]): Promise<Language[]> {
      try {
         const wheres = language_ids.map(id => ({ id }));
         const { data = [], error } = await database.select('languages_schema', 'languages').where(wheres).exec();

         if (error) {
            throw new ErrorDatabase('Failed to find Languages', 'LANGUAGE_FIND_FAILED');
         }

         return data.map(item => new Language(item));
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'LANGUAGE_FIND_FAILED');
      }
   }

   static async update(language_id: number, updates: Partial<LanguageSetup>): Promise<Language | null> {
      try {
         const { data = [], error } = await database.update('languages_schema', 'languages').set(updates).where({ id: language_id }).returning().exec();
         const [ updated ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to update Language', 'LANGUAGE_UPDATE_FAILED');
         }

         if (!updated) {
            return null;
         }

         return new Language(updated);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'LANGUAGE_UPDATE_FAILED');
      }
   }

   static async delete(language_id: number): Promise<boolean> {
      try {
         const { error } = await database.delete('languages_schema', 'languages').where({ id: language_id }).exec();

         if (error) {
            throw new ErrorDatabase('Failed to delete Language', 'LANGUAGE_DELETE_FAILED');
         }

         return true;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'LANGUAGE_DELETE_FAILED');
      }
   }
}

export default Language;
