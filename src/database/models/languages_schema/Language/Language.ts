import ErrorDatabase from '@/services/Database/ErrorDatabase';
import TableRow from '../../../../services/Database/models/TableRow';
import { LanguageLevel, LanguageSetup } from './Language.types';

class Language extends TableRow {
   public default_name: string;
   public local_name: string;
   public locale_code: string;
   public reading_level: LanguageLevel;
   public listening_level: LanguageLevel;
   public writing_level: LanguageLevel;
   public speaking_level: LanguageLevel;

   constructor (setup: LanguageSetup) {
      super('languages_schema', 'languages', setup);
      const { default_name, local_name, locale_code, reading_level, listening_level, writing_level, speaking_level } = setup || {};

      if (!default_name || !local_name || !locale_code || !reading_level || !listening_level || !writing_level || !speaking_level) {
         throw new ErrorDatabase('All fields are required for Language', 'LANGUAGE_REQUIRED_FIELDS');
      }

      this.default_name = default_name;
      this.local_name = local_name;
      this.locale_code = locale_code;
      this.reading_level = reading_level;
      this.listening_level = listening_level;
      this.writing_level = writing_level;
      this.speaking_level = speaking_level;
   }
}

export default Language;
