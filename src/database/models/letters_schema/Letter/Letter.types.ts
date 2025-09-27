import { AdminUser } from "../../users_schema";

export type LetterTypes = 'cover-letter' | 'email' | 'other';

export interface LetterSetup {
   type: LetterTypes;
   subject: string;
   body: string;
   from_id: number;
   from?: AdminUser;
   from_name?: string;
   company_id?: number;
   company_name?: string;
   company_site_url?: string;
   opportunity_id?: number;
   job_title?: string;
}
