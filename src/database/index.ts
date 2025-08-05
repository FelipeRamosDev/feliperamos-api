import { PostgresDB } from '../services';
import { AdminUser } from './models/users_schema';
import companies_schema from './schemas/companies_schema';
import experiences_schema from './schemas/experiences_schema';
import skills_schema from './schemas/skills_schema';
import users_schema from './schemas/users_schema';
import curriculums_schema from './schemas/curriculums_schema';

const database = new PostgresDB({
   dbName: process.env.POSTGRES_DB,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   user: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASSWORD,
   schemas: [
      users_schema,
      skills_schema,
      companies_schema,
      experiences_schema,
      curriculums_schema
   ]
});

database.init().then(async () => {
   const {
      MASTER_USER_EMAIL,
      MASTER_USER_PASSWORD,
      MASTER_USER_FIRST_NAME,
      MASTER_USER_LAST_NAME
   } = process.env;

   try {
      const masterUser = await AdminUser.getMaster();

      if (!masterUser) {
         if (!MASTER_USER_EMAIL || !MASTER_USER_PASSWORD || !MASTER_USER_FIRST_NAME || !MASTER_USER_LAST_NAME) {
            throw new Error('Missing environment variables for master user creation.');
         }

         const created = await AdminUser.createMaster({
            email: MASTER_USER_EMAIL,
            password: MASTER_USER_PASSWORD,
            first_name: MASTER_USER_FIRST_NAME,
            last_name: MASTER_USER_LAST_NAME
         });

         if (!created.success) {
            throw new Error('Failed to create master user.');
         }

         console.log('Master user created successfully.');
      }
   } catch (error: any) {
      console.error('Error verifying master user:', error);
      throw new Error(`Verifying master user failed: ${error.message}`);
   }
}).catch((error) => {
   console.error('Error initializing database:', error);
});

export default database;
