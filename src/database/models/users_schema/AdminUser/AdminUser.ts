import bcrypt from 'bcrypt';
import TableRow from '../../../../services/Database/models/TableRow';
import database from '../../..';
import { AdminUserPublic, CreateUserProps } from './AdminUser.types';

const PUBLIC_FIELDS = [ 'id', 'email', 'first_name', 'last_name', 'role' ];

export default class AdminUser extends TableRow {
   public email: string;
   public password: string;
   public first_name: string;
   public last_name: string;
   public role: 'master' | 'admin' | 'user';

   constructor(data: any) {
      super('users_schema', 'admin_users', data);

      if (!data) {
         throw new Error('Data is required to create an AdminUser instance.');
      }

      const {
         email,
         password,
         first_name,
         last_name,
         role
      } = data;

      this.email = email;
      this.password = password;
      this.first_name = first_name;
      this.last_name = last_name;
      this.role = role;
   }

   get name() {
      return `${this.first_name} ${this.last_name}`;
   }

   toPublic(): AdminUserPublic {
      return {
         id: this.id,
         email: this.email,
         name: this.name,
         first_name: this.first_name,
         last_name: this.last_name,
         role: this.role
      };
   }

   static async createMaster(masterData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
   }): Promise<{ success: boolean; }> {
      try {
         const created = await this.create({
            email: masterData.email,
            password: masterData.password,
            first_name: masterData.first_name,
            last_name: masterData.last_name,
            role: 'master'
         });

         if (!created.success) {
            throw new Error('Failed to create master user.');
         }

         return { success: true };
      } catch (error: any) {
         throw new Error(`Creating master user failed: ${error.message}`);
      }
   }

   static async getMaster(): Promise<AdminUserPublic | null> {
      try {
         const query = database.select('users_schema', 'admin_users');

         query.selectFields(PUBLIC_FIELDS);
         query.where({ role: 'master' });
         query.limit(1);

         const { data = [] } = await query.exec();
         const [ user ] = data;

         if (!user) {
            return null;
         }

         return new AdminUser(user);
      } catch (error: any) {
         throw new Error(`Fetching master user failed: ${error.message}`);
      }
   }

   static async create(userData: CreateUserProps): Promise<{ success: boolean; }> {
      if (!userData || !userData.email || !userData.password || !userData.first_name || !userData.last_name) {
         throw new Error('Invalid user data provided.');
      }

      const {
         email,
         password,
         first_name,
         last_name,
         role
      } = userData;

      try {
         const hashedPassword = await bcrypt.hash(password, 10);
         const created = await database.insert('users_schema', 'admin_users').data({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            role: role || 'user'
         }).exec();

         if (created.error) {
            throw created;
         }

         return { success: true };
      } catch (error: any) {
         console.error('Error creating user:', error);
         throw new Error(`Creating user failed: ${error.message}`);
      }
   }

   static async getByEmail(email: string): Promise<AdminUser | null> {
      if (!email) {
         throw new Error('Email is required to fetch user.');
      }

      try {
         const query = database.select('users_schema', 'admin_users');

         query.selectFields(PUBLIC_FIELDS);
         query.where({ email });
         query.limit(1);
         const { data = [] } = await query.exec();
         const [ user ] = data;

         if (!user) {
            return null;
         }

         return new AdminUser(user);
      } catch (error: any) {
         throw new Error(`Fetching user by email failed: ${error.message}`);
      }
   }

   static async validateUser(email: string, password: string): Promise<AdminUserPublic | null> {
      if (!email || !password) {
         throw new Error('Email and password are required for validation.');
      }

      try {
         const query = database.select('users_schema', 'admin_users');

         query.where({ email });
         query.limit(1);

         const { data = [] } = await query.exec();
         const [ user ] = data;

         if (!user) {
            return null;
         }

         const isPasswordValid = await bcrypt.compare(password, user.password);
         if (!isPasswordValid) {
            return null;
         }

         return new AdminUser(user).toPublic();
      } catch (error: any) {
         throw new Error(`Validating user failed: ${error.message}`);
      }
   }
}
