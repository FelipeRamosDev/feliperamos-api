import TableRow from '../../../../services/Database/models/TableRow';
import { OpportunitySetup } from './Opportunity.types';
import { CV } from '../../curriculums_schema';
import { Company } from '../../companies_schema';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import database from '../../../../database';

export default class Opportunity extends TableRow {
   public job_url?: string;
   public job_title?: string;
   public job_description?: string;
   public location?: string;
   public seniority_level?: string;
   public employment_type?: string;
   public cv_id?: number;
   public company_id?: number;
   public relatedCV?: CV;
   public company?: Company;
   public opportunity_user_id: number;

   constructor (setup: OpportunitySetup) {
      super('opportunities_schema', 'opportunities', setup);

      const {
         job_url,
         job_title,
         job_description,
         location,
         seniority_level,
         employment_type,
         cv_id,
         company_id,
         relatedCV,
         company,
         opportunity_user_id
      } = setup || {};

      this.job_url = job_url;
      this.job_title = job_title;
      this.job_description = job_description;
      this.location = location;
      this.seniority_level = seniority_level;
      this.employment_type = employment_type;
      this.cv_id = cv_id;
      this.company_id = company_id;
      this.opportunity_user_id = opportunity_user_id;

      if (relatedCV) {
         this.relatedCV = new CV(relatedCV);
      }

      if (company) {
         this.company = new Company(company);
      }
   }

   toSave() {
      return {
         job_url: this.job_url,
         job_title: this.job_title,
         job_description: this.job_description,
         location: this.location,
         seniority_level: this.seniority_level,
         employment_type: this.employment_type,
         cv_id: this.cv_id,
         company_id: this.company_id,
         opportunity_user_id: this.opportunity_user_id
      };
   }

   async save(): Promise<Opportunity> {
      try {
         const createQuery = database.insert('opportunities_schema', 'opportunities').data(this.toSave()).returning();
         const { data = [], error } = await createQuery.exec();

         if (error) {
            throw new ErrorDatabase(error.message, error.code);
         }

         const [ opportunity ] = data;
         return new Opportunity(opportunity);
      } catch (error: any) {
         throw new ErrorDatabase(error.message || 'Error saving opportunity', error.code || 'ERROR_SAVE_OPPORTUNITY');
      }
   }
}
