import TableRow from '../../../../services/Database/models/TableRow';
import { CompanySetSetup } from './CompanySet.types';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';

export default class CompanySet extends TableRow {
   public description: string;
   public industry: string;
   public user_id?: number;
   public company_id?: number;

   constructor (setup: CompanySetSetup, schemaName: string = 'companies_schema', tableName: string = 'company_sets') {
      super(schemaName, tableName, setup);

      const {
         company_id,
         user_id,
         description = '',
         industry = ''
      } = setup || {};

      this.company_id = company_id;
      this.user_id = user_id;
      this.description = description;
      this.industry = industry;
   }

   static async set(data: CompanySetSetup): Promise<CompanySet> {
      const { company_id, description, industry, user_id } = data;

      const created = await database.insert('companies_schema', 'company_sets').data({
         company_id,
         description,
         industry,
         user_id
      }).returning().exec();

      if (created.error) {
         throw new ErrorDatabase('Failed to update company set', 'COMPANY_SET_CREATION_ERROR');
      }

      const [ createdSet ] = created.data || [];
      if (!createdSet) {
         throw new ErrorDatabase('No company set created', 'COMPANY_SET_CREATION_ERROR');
      }

      return new CompanySet(createdSet);
   }
}
