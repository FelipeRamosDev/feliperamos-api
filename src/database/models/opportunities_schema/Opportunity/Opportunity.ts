import TableRow from '../../../../services/Database/models/TableRow';
import { OpportunitySetup } from './Opportunity.types';
import { CV } from '../../curriculums_schema';
import { Company } from '../../companies_schema';

export default class Opportunity extends TableRow {
   public start_date: Date;
   public end_date: Date;
   public job_title: string;
   public job_description: string;
   public location: string;
   public seniority_level: string;
   public employment_type: string;
   public cv_id: number;
   public company_id: number;
   public relatedCV?: CV;
   public company?: Company;

   constructor (setup: OpportunitySetup) {
      super('opportunities_schema', 'opportunities', setup);

      const {
         start_date,
         end_date,
         job_title,
         job_description,
         location,
         seniority_level,
         employment_type,
         cv_id,
         company_id,
         relatedCV,
         company
      } = setup || {};

      this.start_date = start_date;
      this.end_date = end_date;
      this.job_title = job_title;
      this.job_description = job_description;
      this.location = location;
      this.seniority_level = seniority_level;
      this.employment_type = employment_type;
      this.cv_id = cv_id;
      this.company_id = company_id;

      if (relatedCV) {
         this.relatedCV = new CV(relatedCV);
      }

      if (company) {
         this.company = new Company(company);
      }
   }
}
