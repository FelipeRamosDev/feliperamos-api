import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { EducationSet } from '../../database/models/educations_schema';

export default new Route({
   method: 'PATCH',
   routePath: '/education/update-set',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req, res) => {
      const { set_id, updates } = req.body;
      const setId = Number(set_id);

      if (!set_id || !updates) {
         new ErrorResponseServerAPI('Education Set ID and updates are required', 400, 'EDUCATION_SET_ID_AND_UPDATES_REQUIRED').send(res);
         return;
      }

      if (isNaN(setId) || setId <= 0) {
         new ErrorResponseServerAPI('Invalid Education Set ID', 400, 'INVALID_EDUCATION_SET_ID').send(res);
         return;
      }

      try {
         const updated = await EducationSet.updateSet(setId, updates);

         if (!updated) {
            new ErrorResponseServerAPI('Failed to update education set record', 404, 'EDUCATION_SET_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error: any) {
         new ErrorResponseServerAPI('Failed to update education set record', 500, 'EDUCATION_SET_UPDATE_FAILED').send(res);
      }
   }
});

