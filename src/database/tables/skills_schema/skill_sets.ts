import { defaultLocale } from '../../../app.config';
import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'skill_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'language_set', type: 'VARCHAR(2)', defaultValue: defaultLocale },
      { name: 'journey', type: 'VARCHAR(255)' },
      { 
         name: 'user_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      },
      { 
         name: 'skill_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'skills_schema',
            table: 'skills',
            field: 'id'
         }
      }
   ]
});
