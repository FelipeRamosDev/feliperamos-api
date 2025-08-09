import { Education } from '../../database/models/educations_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/education/create',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not found', 401, 'Unauthorized').send(res);
         return;
      }

      try {
         const education = new Education({ ...req.body, user_id: userId });
         const created = await education.save();

         res.status(201).send(created);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to create education', 500, 'Server Error').send(res);
      }
   }
});
