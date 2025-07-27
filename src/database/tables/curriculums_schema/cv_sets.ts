import Table from "../../../services/Database/models/Table";

export default new Table({
   name: 'cv_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'job_title', type: 'VARCHAR(255)' },
      { name: 'summary', type: 'TEXT' },
      { name: 'language_set', type: 'VARCHAR(2)', notNull: true },
      { name: 'user_id', type: 'INTEGER', notNull: true, relatedField: {
         schema: 'users_schema',
         table: 'admin_users',
         field: 'id'
      }},
      { name: 'cv_id', type: 'INTEGER', notNull: true, relatedField: {
         schema: 'curriculums_schema',
         table: 'cvs',
         field: 'id'
      }}
   ]
});
