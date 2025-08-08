import { Language } from '../../database/models/languages_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/language/update',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_id, updates } = req.body || {};
      const languageId = Number(language_id);

      if (isNaN(languageId)) {
         new ErrorResponseServerAPI('Invalid language ID', 400, 'INVALID_LANGUAGE_ID').send(res);
         return;
      }

      try {
         const language = await Language.update(languageId, updates);

         if (!language) {
            new ErrorResponseServerAPI('Language not found', 404, 'LANGUAGE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(language);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code || 'INTERNAL_SERVER_ERROR').send(res);
         return;
      }
   }
});
