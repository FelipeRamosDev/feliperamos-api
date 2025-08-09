import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'education_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'degree', type: 'VARCHAR(255)' },
      { name: 'field_of_study', type: 'VARCHAR(255)' },
      { name: 'grade', type: 'VARCHAR(50)' },
      { name: 'description', type: 'TEXT' },
      {
         name: 'education_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'educations_schema',
            table: 'educations',
            field: 'id'
         }
      },
      {
         name: 'user_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      }
   ]
});
