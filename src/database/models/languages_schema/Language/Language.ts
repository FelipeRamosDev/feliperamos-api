import LanguageSet from '../LanguageSet/LanguageSet';
import { LanguageLevel, LanguageSetup } from './Language.types';

class Language extends LanguageSet {
   public locale_code: string;
   public reading_level: LanguageLevel;
   public listening_level: LanguageLevel;
   public writing_level: LanguageLevel;
   public speaking_level: LanguageLevel;

   constructor (setup: LanguageSetup) {
      super(setup, 'languages_schema', 'languages');
      const { locale_code, reading_level, listening_level, writing_level, speaking_level } = setup || {};

      if (!locale_code || !reading_level || !listening_level || !writing_level || !speaking_level) {
         throw new Error('Missing required fields for Language');
      }

      this.locale_code = locale_code;
      this.reading_level = reading_level;
      this.listening_level = listening_level;
      this.writing_level = writing_level;
      this.speaking_level = speaking_level;
   }
}

export default Language;
