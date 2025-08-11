export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced' | 'proficient' | 'native';

export interface LanguageSetup {
   default_name: string;
   locale_name: string;
   locale_code: string;
   proficiency: LanguageLevel;
   language_user_id: number;
}
