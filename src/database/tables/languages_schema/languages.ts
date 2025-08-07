import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'languages',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'locale_code', type: 'VARCHAR(2)', notNull: true },
      { name: 'reading_level', type: 'VARCHAR(50)', notNull: true },
      { name: 'listening_level', type: 'VARCHAR(50)', notNull: true },
      { name: 'writing_level', type: 'VARCHAR(50)', notNull: true },
      { name: 'speaking_level', type: 'VARCHAR(50)', notNull: true },
   ]
});
