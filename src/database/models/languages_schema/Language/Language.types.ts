export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export interface LanguageSetup {
   default_name: string;
   local_name: string;
   locale_code: string;
   reading_level: LanguageLevel;
   listening_level: LanguageLevel;
   writing_level: LanguageLevel;
   speaking_level: LanguageLevel;
   language_user_id: string;
}
