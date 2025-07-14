import TableRow from '../../../../services/Database/models/TableRow';
import { CompanySetSetup } from './CompanySet.types';
import database from '../../../../database';

export default class CompanySet extends TableRow {
   public description: string;
   public industry: string;
   public user_id: number;
   public company_id: number;

   constructor (setup: CompanySetSetup, schemaName: string = 'companies_schema', tableName: string = 'company_sets') {
      super(schemaName, tableName, setup);

      const {
         company_id,
         user_id,
         description = '',
         industry = ''
      } = setup || {};

      if (!company_id || !user_id) {
         throw new Error('Company ID and User ID are required to create a company set.');
      }

      this.company_id = company_id;
      this.user_id = user_id;
      this.description = description;
      this.industry = industry;
   }

   static async set(data: CompanySetSetup): Promise<CompanySet> {
      const { company_id, description, industry } = data;

      const created = await database.insert('companies_schema', 'company_sets').data({
         company_id,
         description,
         industry
      }).returning().exec();

      if (created.error) {
         throw new Error('Failed to update company set');
      }

      const [ createdSet ] = created.data || [];
      if (!createdSet) {
         throw new Error('No company set created');
      }

      return new CompanySet(createdSet);
   }
}
