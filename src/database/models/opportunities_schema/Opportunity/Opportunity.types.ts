import { CompanySetup } from '../../companies_schema/Company/Company.types';
import { CVSetup } from '../../curriculums_schema/CV/CV.types';

export interface OpportunitySetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   start_date: Date;
   end_date: Date;
   job_title: string;
   job_description: string;
   location: string;
   seniority_level: string;
   employment_type: string;
   cv_id: number;
   company_id: number;
   relatedCV?: CVSetup;
   company?: CompanySetup;
}
