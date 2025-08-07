import { LanguageSetSetup } from '../LanguageSet/LanguageSet.types';

export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export interface LanguageSetup extends LanguageSetSetup {
   locale_code: string;
   reading_level: LanguageLevel;
   listening_level: LanguageLevel;
   writing_level: LanguageLevel;
   speaking_level : LanguageLevel;
}
