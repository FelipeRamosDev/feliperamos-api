import Table from "../../../services/Database/models/Table";

export default new Table({
   name: 'cvs',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'is_master', type: 'BOOLEAN', defaultValue: false },
      { name: 'notes', type: 'TEXT' },
      { name: 'cv_experiences', type: 'INTEGER[]' },
      { name: 'cv_skills', type: 'INTEGER[]' },
      { name: 'cv_owner_id', type: 'INTEGER' },
   ]
});
