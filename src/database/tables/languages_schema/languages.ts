import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'languages',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'default_name', type: 'VARCHAR(100)', notNull: true },
      { name: 'locale_name', type: 'VARCHAR(100)', notNull: true },
      { name: 'locale_code', type: 'VARCHAR(2)', notNull: true },
      { name: 'proficiency', type: 'VARCHAR(50)', notNull: true },
      {
         name: 'language_user_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            field: 'id',
            schema: 'users_schema',
            table: 'admin_users'
         }
      }
   ]
});
