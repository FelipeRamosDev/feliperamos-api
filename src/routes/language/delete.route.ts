import { Language } from '../../database/models/languages_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'DELETE',
   routePath: '/language/delete',
   // useAuth: true,
   // allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_id } = req.body || {};

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
         const deleted = await Language.delete(languageIdNum);
         if (!deleted) {
            new ErrorResponseServerAPI('Failed to delete Language', 400, 'LANGUAGE_DELETE_FAILED').send(res);
            return;
         }

         res.status(200).send(deleted);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code || 'INTERNAL_SERVER_ERROR').send(res);
         return;
      }
   }
});
