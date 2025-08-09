import { Education } from '../../database/models/educations_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/user/educations',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { language_set } = req.query;
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User ID not found in session', 401, 'ERR_UNAUTHORIZED').send(res);
         return;
      }

      try {
         const educations = await Education.findByUserId(userId, language_set as string);
         res.status(200).send(educations);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to fetch user educations', 500, 'ERR_FETCH_FAILED').send(res);
      }
   }
});
