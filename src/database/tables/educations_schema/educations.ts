import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'educations',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'institution_name', type: 'VARCHAR(255)', notNull: true },
      { name: 'start_date', type: 'DATE', notNull: true },
      { name: 'end_date', type: 'DATE', notNull: false },
      { name: 'is_current', type: 'BOOLEAN', defaultValue: false },
      {
         name: 'student_id',
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
