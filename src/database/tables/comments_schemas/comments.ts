import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'comments',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'content', type: 'TEXT', notNull: true },
      {
         name: 'author_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      }
   ]
});

