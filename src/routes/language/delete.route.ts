import { Language } from '../../database/models/languages_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/language/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_id } = req.body || {};

      if (!language_id) {
         new ErrorResponseServerAPI('Language ID is required', 400, 'REQUIRED_LANGUAGE_ID').send(res);
         return;
      }

      try {
         const deleted = await Language.delete(language_id);

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
