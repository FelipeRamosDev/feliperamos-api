import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Education } from '../../database/models/educations_schema';

export default new Route({
   method: 'PATCH',
   routePath: '/education/update',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req, res) => {
      const { education_id, updates } = req.body;
      const educationId = Number(education_id);

      if (!education_id || !updates) {
         new ErrorResponseServerAPI('Education ID and updates are required', 400, 'EDUCATION_ID_AND_UPDATES_REQUIRED').send(res);
         return;
      }

      if (isNaN(educationId) || educationId <= 0) {
         new ErrorResponseServerAPI('Invalid Education ID', 400, 'INVALID_EDUCATION_ID').send(res);
         return;
      }

      try {
         const updated = await Education.update(educationId, updates);

         if (!updated) {
            new ErrorResponseServerAPI('Failed to update education record', 404, 'EDUCATION_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error: any) {
         new ErrorResponseServerAPI('Failed to update education record', 500, 'EDUCATION_UPDATE_FAILED').send(res);
      }
   }
});
