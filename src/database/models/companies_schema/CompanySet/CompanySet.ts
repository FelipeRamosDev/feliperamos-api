import TableRow from '../../../../services/Database/models/TableRow';
import { CompanySetSetup } from './CompanySet.types';
import database from '../../../../database';

export default class CompanySet extends TableRow {
   public description: string;
   public industry: string;

   constructor (setup: CompanySetSetup, schemaName: string = 'companies_schema', tableName: string = 'company_sets') {
      super(schemaName, tableName, setup);

      const {
         description = '',
         industry = ''
      } = setup || {};

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
