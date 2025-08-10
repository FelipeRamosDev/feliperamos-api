import { AdminUser } from '../../database/models/users_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/user/languages',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req, res) => {
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'Unauthorized').send(res);
         return;
      }

      try {
         const languages = await AdminUser.getLanguages(userId);

         if (!languages) {
            new ErrorResponseServerAPI('No languages found for the user', 404, 'Not Found').send(res);
            return;
         }

         res.status(200).send(languages.map(lang => lang.toObject()));
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code || 'Internal Server Error').send(res);
      }
   }
});
