import { Company } from '../../companies_schema';
import { SkillSetup } from '../../skills_schema/Skill/Skill.types';
import { AdminUser } from '../../users_schema';
import { ExperienceSetSetup } from '../ExperienceSet/ExperienceSet.types';

export type ExperienceType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance' | undefined;
export type ExperienceStatus = 'draft' | 'published' | 'archived';

export interface ExperienceSetup extends ExperienceSetSetup {
   type: ExperienceType;
   status: ExperienceStatus;
   title: string;
   start_date: string;
   end_date: string;
   company_id: number;
   company?: Company;
   user?: AdminUser;
   skills: SkillSetup[];
   languageSets?: ExperienceSetSetup[];
}

export interface ExperienceCreateSetup {
   type: ExperienceType;
   status?: ExperienceStatus;
   title: string;
   start_date: string;
   end_date?: string | null;
   company_id: number;
   skills?: number[];
   slug?: string;
   position?: string;
   language_set?: string;
   summary?: string;
   description?: string;
   responsibilities?: string;
   user_id: number;
}
