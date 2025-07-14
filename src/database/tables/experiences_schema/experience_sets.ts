import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'experience_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'slug', type: 'VARCHAR(255)', notNull: true },
      { name: 'position', type: 'VARCHAR(20)', notNull: true },
      { name: 'language_set', type: 'VARCHAR(2)', defaultValue: 'en' },
      { name: 'summary', type: 'TEXT', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'responsibilities', type: 'TEXT' },
      {
         name: 'experience_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'experiences_schema',
            table: 'experiences',
            field: 'id'
         }
      },
      {
         name: 'user_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      }
   ]
});
