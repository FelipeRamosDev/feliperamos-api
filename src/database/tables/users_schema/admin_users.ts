import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'admin_users',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'email', type: 'VARCHAR(255)', unique: true },
      { name: 'phone', type: 'VARCHAR(25)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'first_name', type: 'VARCHAR(255)' },
      { name: 'last_name', type: 'VARCHAR(255)' },
      { name: 'birth_date', type: 'DATE' },
      { name: 'country', type: 'VARCHAR(255)' },
      { name: 'state', type: 'VARCHAR(255)' },
      { name: 'city', type: 'VARCHAR(255)' },
      { name: 'role', type: 'VARCHAR(50)', defaultValue: 'admin' },
      { name: 'avatar_url', type: 'VARCHAR(255)' },
      { name: 'portfolio_url', type: 'VARCHAR(255)' },
      { name: 'github_url', type: 'VARCHAR(255)' },
      { name: 'linkedin_url', type: 'VARCHAR(255)' },
      { name: 'whatsapp_number', type: 'VARCHAR(255)' },
   ]
});