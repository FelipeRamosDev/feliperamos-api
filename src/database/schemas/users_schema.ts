import Schema from '../../services/Database/models/Schema';
import admin_users from '../tables/users_schema/admin_users';

export default new Schema({
   name: 'users_schema',
   tables: [ admin_users ]
});
