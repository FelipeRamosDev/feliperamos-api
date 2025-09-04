import { CompanySetup } from '../../companies_schema/Company/Company.types';
import { CVSetup } from '../../curriculums_schema/CV/CV.types';

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
}
