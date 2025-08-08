import { Language } from '../../database/models/languages_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/language/create',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const body = req.body || {};
      const userId = req.session?.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      try {
         const language = new Language({ ...body, language_user_id: userId });
         const saved = await language.save();

         if (!saved) {
            new ErrorResponseServerAPI('Failed to create language', 400, 'LANGUAGE_CREATION_FAILED').send(res);
            return;
         }

         res.status(200).send(saved);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code || 'INTERNAL_SERVER_ERROR').send(res);
         return;
      }
   }
});
