import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'companies',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'name', type: 'VARCHAR(255)', notNull: true },
      { name: 'location', type: 'VARCHAR(255)', notNull: true },
      { name: 'site_url', type: 'VARCHAR(255)' },
      { name: 'logo_url', type: 'VARCHAR(255)' },
   ]
});
