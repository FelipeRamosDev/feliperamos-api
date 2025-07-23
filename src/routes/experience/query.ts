import { Request, Response } from 'express';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Experience } from '../../database/models/experiences_schema';
import ErrorDatabase from '../../services/Database/ErrorDatabase';

export default new Route({
   method: 'GET',
   routePath: '/experience/query',
   useAuth: true,
   allowedRoles: [ 'master', 'admin' ],
   controller: async (req: Request, res: Response) => {
      const userId = req.session.user?.id;
      const { language_set } = req.query;

      if (!userId) {
         new ErrorResponseServerAPI('User ID is not present in the session!', 401, 'USER_ID_NOT_FOUND').send(res);
         return;
      }

      try {
         const experiences = await Experience.getByUserId(userId, language_set as string);

         if (!experiences || !Array.isArray(experiences)) {
            throw new ErrorResponseServerAPI('Experiences invalid format!', 400, 'EXPERIENCES_INVALID_FORMAT');
         }

         const sortedExperiences = experiences.sort((a, b) => {
            if (!b.start_date) return 1;
            if (!a.start_date) return -1;
            if (a.start_date === b.start_date) return 0;

            return a.start_date > b.start_date ? -1 : 1;
         });

         res.status(200).send(sortedExperiences);
      } catch (error) {
         if (error instanceof ErrorResponseServerAPI) {
            error.send(res);
         } else if (error instanceof ErrorDatabase) {
            new ErrorResponseServerAPI(error.message, 500, error.code).send(res);
         } else {
            new ErrorResponseServerAPI().send(res);
         }
      }
   }
});
