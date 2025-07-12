import TableRow from '../../../../services/Database/models/TableRow';
import { CompanySetSetup } from './CompanySet.types';
import database from '../../../../database';

export default class CompanySet extends TableRow {
   public description: string;
   public field_activity: string;

   constructor (setup: CompanySetSetup, schemaName: string = 'companies_schema', tableName: string = 'company_set') {
      super(schemaName, tableName, setup);

      const {
         description = '',
         field_activity = ''
      } = setup || {};

      this.description = description;
      this.field_activity = field_activity;
   }

   static async set(data: CompanySetSetup): Promise<CompanySet> {
      const { company_id, description, field_activity } = data;

      const created = await database.insert('companies_schema', 'company_sets').data({
         company_id,
         description,
         field_activity
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
