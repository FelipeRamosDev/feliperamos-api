import { Route } from '../../services';
import { Language } from '../../database/models/languages_schema';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/language/:language_id',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_id } = req.params || {};

      if (language_id === undefined || language_id === null) {
         new ErrorResponseServerAPI('Language ID is required', 400, 'REQUIRED_LANGUAGE_ID').send(res);
         return;
      }

      const languageIdNum = Number(language_id);
      if (!Number.isFinite(languageIdNum) || Number.isNaN(languageIdNum)) {
         new ErrorResponseServerAPI('Language ID must be a valid number', 400, 'INVALID_LANGUAGE_ID').send(res);
         return;
      }

      try {
         const language = await Language.findById(languageIdNum);
         if (!language) {
            new ErrorResponseServerAPI('Language not found', 404, 'LANGUAGE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(language.toObject());
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code || 'INTERNAL_SERVER_ERROR').send(res);
         return;
      }
   }
})
