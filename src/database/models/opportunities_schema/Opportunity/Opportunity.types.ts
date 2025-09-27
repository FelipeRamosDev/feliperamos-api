import { CompanySetup } from '../../companies_schema/Company/Company.types';
import { CVSetup } from '../../curriculums_schema/CV/CV.types';
import { LetterSetup } from '../../letters_schema/Letter/Letter.types';
import Opportunity from './Opportunity';

export type OpportunityOrderOptions = 'ASC' | 'DESC';

export interface OpportunitySetup {
   job_url?: string;
   job_title: string;
   job_description: string;
   location: string;
   seniority_level: string;
   employment_type: string;
   cv_id?: number;
   company_id?: number;
   relatedCV?: CVSetup;
   company?: CompanySetup;
   opportunity_user_id: number;
   coverLetter?: LetterSetup;
}

export interface OpportunitySearchParams {
   where?: Partial<Opportunity>;
   sort?: keyof Opportunity;
   order?: OpportunityOrderOptions;
   userID?: number;
}
