import { ExperienceSetSetup } from '../ExperienceSet/ExperienceSet.types';

export type ExperienceType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance' | undefined;
export type ExperienceStatus = 'draft' | 'published' | 'archived';

export interface ExperienceSetup extends ExperienceSetSetup {
   type: ExperienceType;
   status: ExperienceStatus;
   name: string;
   start_date: string;
   end_date: string;
   company_id: number;
   skills: number[];
}

export interface ExperienceCreateSetup {
   type: ExperienceType;
   status?: ExperienceStatus;
   name: string;
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
}
