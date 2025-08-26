import { Request, Response } from 'express';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import CV from '../../database/models/curriculums_schema/CV/CV';

export default new Route({
   method: 'GET',
   routePath: '/user/cvs',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req: Request, res: Response) => {
      const userId = req.session?.user?.id;
      const { language_set, is_favorite } = req.query;

      if (!userId) {
         new ErrorResponseServerAPI('User ID is required', 400, 'USER_ID_REQUIRED').send(res);
         return;
      }

      try {
         const cvs = await CV.getUserCVs(userId, {
            language_set: language_set as string,
            is_favorite: is_favorite !== undefined ? Boolean(is_favorite) : undefined
         });

         if (!cvs) {
            new ErrorResponseServerAPI('No CVs found for this user', 404, 'CVS_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(cvs);
      } catch (error) {
         console.error('Error processing curriculum query:', error);
         new ErrorResponseServerAPI('Internal Server Error', 500, 'INTERNAL_SERVER_ERROR').send(res);
      }
   }
});
