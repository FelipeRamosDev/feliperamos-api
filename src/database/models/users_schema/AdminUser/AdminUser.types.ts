export interface CreateUserProps {
   email: string;
   password: string;
   first_name: string;
   last_name: string;
   role?: 'master' | 'admin' | 'user';
}

export interface AdminUserPublic {
   id?: number;
   email: string;
   name: string;
   first_name: string;
   last_name: string;
   role: 'master' | 'admin' | 'user';
};
