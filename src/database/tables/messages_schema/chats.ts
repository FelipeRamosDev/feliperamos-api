import { defaultSystemType } from '../../../app.config';
import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'chats',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'system_type', type: 'VARCHAR(255)', defaultValue: defaultSystemType },
      { name: 'label', type: 'VARCHAR(255)' },
      { name: 'model', type: 'VARCHAR(100)' },
      { name: 'instructions', type: 'TEXT' },
   ]
});
