import Schema from '../../services/Database/builders/Schema';
import admin_users from './tables/admin_users';

export default new Schema({
   name: 'users_schema',
   tables: [ admin_users ]
});
