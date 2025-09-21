import { createLetterPDF } from '../../../helpers/database.helper';
import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'letters',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'type', type: 'VARCHAR(50)', defaultValue: 'cover-letter' },
      { name: 'subject', type: 'VARCHAR(255)', notNull: true },
      { name: 'body', type: 'TEXT', notNull: true },
      {
         name: 'from_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      },
      {
         name: 'company_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'companies_schema',
            table: 'companies',
            field: 'id'
         }
      },
      {
         name: 'opportunity_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'opportunities_schema',
            table: 'opportunities',
            field: 'id'
         }
      }
   ],
   events: {
      async onAfterInsert(query) {
         const created = query.firstRow;
         if (!created) return;

         createLetterPDF(created.id);
      },
      async onAfterUpdate(query) {
         const created = query.firstRow;
         if (!created) return;

         createLetterPDF(created.id);
      }
   }
});

