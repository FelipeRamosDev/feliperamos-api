import { Request, Response } from 'express';
import { Route } from '../../services';

export default new Route({
   method: 'GET',
   routePath: '/auth/user',
   controller: async (req: Request, res: Response) => {
      if (!req.session.user) {
         res.status(200).send(null);
         return;
      }

      res.status(200).send(req.session.user);
   }
});
