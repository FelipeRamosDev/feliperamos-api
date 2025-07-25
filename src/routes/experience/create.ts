import { Request, Response } from 'express';
import { Route } from '../../services'
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Experience } from '../../database/models/experiences_schema';

export default new Route({
   method: 'POST',
   routePath: '/experience/create',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req: Request, res: Response) => {
      const data = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User is not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      if (!data || !Object.keys(data).length) {
         new ErrorResponseServerAPI('Param "data" is required', 400, 'EXPERIENCE_DATA_REQUIRED').send(res);
         return;
      }

      try {
         const created = await Experience.create({ ...data, user_id: userId });
         if (!created) {
            throw new ErrorResponseServerAPI('Failed to create experience', 500, 'EXPERIENCE_CREATION_FAILED');
         }

         res.status(200).send(created);
      } catch (error) {
         console.error('Error creating experience:', error);

         if (error instanceof ErrorResponseServerAPI) {
            error.send(res);
         } else {
            new ErrorResponseServerAPI('An unexpected error occurred', 500, 'UNEXPECTED_ERROR').send(res);
         }
      }
   }
});
