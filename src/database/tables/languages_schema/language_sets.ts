import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'language_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'language_set', type: 'VARCHAR(2)', notNull: true },
      { name: 'display_name', type: 'VARCHAR(100)' },
   ]
});
