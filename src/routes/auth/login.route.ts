import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { AdminUser } from '../../database/models/users_schema';
import { Route } from '../../services';
import { AdminUserPublic } from '@/database/models/users_schema/AdminUser/AdminUser.types';
import jwt, { SignOptions } from 'jsonwebtoken';

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

         if (!process.env.JWT_SECRET) {
            throw new ErrorResponseServerAPI('JWT_SECRET is not defined in the environment variables');
         }

         const JWT_SECRET = process.env.JWT_SECRET;

         // Create a safe payload for JWT (only include serializable data)
         const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now
         const jwtPayload = {
            id: isAuthenticated.id,
            email: isAuthenticated.email,
            name: isAuthenticated.name,
            role: isAuthenticated.role,
            iat: Math.floor(Date.now() / 1000),
            exp: expirationTime
         };

         const token = jwt.sign(jwtPayload, JWT_SECRET);
         req.session.user = isAuthenticated;

         res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
         res.status(200).send(isAuthenticated);
      } catch (error) {
         new ErrorResponseServerAPI().send(res);
      }
   }
});
