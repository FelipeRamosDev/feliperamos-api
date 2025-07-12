import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'companie_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'language_set', type: 'VARCHAR(255)', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'company_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'companies_schema',
            table: 'companies',
            field: 'id'
         }
      },
   ]
});
