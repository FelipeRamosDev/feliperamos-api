import { Route } from '../../services';
import Language from '../../database/models/languages_schema/Language/Language';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/language/:language_id',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_id } = req.params || {};
      const languageId = Number(language_id);

      if (isNaN(languageId)) {
         new ErrorResponseServerAPI('Invalid language ID', 400, 'INVALID_LANGUAGE_ID').send(res);
         return;
      }

      try {
         const language = await Language.findById(languageId);

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
