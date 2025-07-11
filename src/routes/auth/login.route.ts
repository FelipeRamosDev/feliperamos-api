import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { AdminUser } from '../../database/models/users_schema';
import { Route } from '../../services';
import { AdminUserPublic } from '@/database/models/users_schema/AdminUser/AdminUser.types';

declare module 'express-session' {
   interface SessionData {
      user?: AdminUserPublic;
   }
}

export default new Route({
   method: 'POST',
   routePath: '/auth/login',
   controller: async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
         new ErrorResponseServerAPI('Email and password are required.', 400, 'EMAIL_PASSWORD_REQUIRED').send(res);
         return;
      }

      try {
         const isAuthenticated = await AdminUser.validateUser(email, password);
         if (!isAuthenticated) {
            new ErrorResponseServerAPI('Invalid email or password.', 401, 'INVALID_EMAIL_PASSWORD').send(res);
            return;
         }

         req.session.user = isAuthenticated;
         res.status(200).send({
            success: true,
            user: isAuthenticated
         });
      } catch (error) {
         new ErrorResponseServerAPI().send(res);
      }
   }
});
