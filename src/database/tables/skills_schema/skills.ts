import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'skills',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'name', type: 'VARCHAR(255)', notNull: true },
      { name: 'category', type: 'VARCHAR(255)', notNull: true }
   ]
});
