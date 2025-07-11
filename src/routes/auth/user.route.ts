import { Request, Response } from 'express';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/auth/user',
   useAuth: true,
   allowedRoles: ['master'],
   controller: async (req: Request, res: Response) => {
      if (!req.session.user) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'UNAUTHORIZED').send(res);
         return;
      }

      res.status(200).send(req.session.user);
   }
});
