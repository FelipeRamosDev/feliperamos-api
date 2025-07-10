import { PostgresDB } from '../services';
import users_schema from './schemas/users_schema';

const database = new PostgresDB({
   dbName: process.env.DB_NAME,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   schemas: [
      users_schema
   ]
});

database.init().then(async (DB) => {
   try {
      const masterQuery = DB.select('users_schema', 'admin_users').where({ role: 'master' }).limit(1);
      const { data = [] } = await masterQuery.exec();
      const [ masterUser ] = data;
      
      if (!masterUser) {
         await DB.insert('users_schema', 'admin_users').data({
            email: process.env.MASTER_USER_EMAIL,
            password: process.env.MASTER_USER_PASSWORD,
            first_name: process.env.MASTER_USER_FIRST_NAME,
            last_name: process.env.MASTER_USER_LAST_NAME,
            role: 'master'
         }).exec();
      }
   } catch (error: any) {
      console.error('Error verifying master user:', error);
      throw new Error(`Verifying master user failed: ${error.message}`);
   }
}).catch((error) => {
   console.error('Error initializing database:', error);
});

export default database;
