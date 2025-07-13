import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'experiences',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'type', type: 'VARCHAR(255)', notNull: true },
      { name: 'status', type: 'VARCHAR(255)', defaultValue: 'draft' },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
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
         name: 'skills',
         type: 'INTEGER[]'
      }
   ]
});
