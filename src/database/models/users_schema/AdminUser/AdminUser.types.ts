export type UserRoles = 'master' | 'admin' | 'user';

export interface CreateUserProps {
   email: string;
   password: string;
   first_name: string;
   last_name: string;
   role?: UserRoles;
   phone?: string;
}

export interface AdminUserPublic {
   id?: number;
   email: string;
   phone?: string;
   name: string;
   first_name: string;
   last_name: string;
   role: UserRoles;
   avatar_url?: string;
   portfolio_url?: string;
   github_url?: string;
   linkedin_url?: string;
   whatsapp_url?: string;
};
