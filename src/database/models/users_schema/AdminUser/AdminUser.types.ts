export interface CreateUserProps {
   email: string;
   password: string;
   first_name: string;
   last_name: string;
   role?: 'master' | 'admin' | 'user';
}
