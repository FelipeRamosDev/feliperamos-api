import CV from '../../database/models/curriculums_schema/CV/CV';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/curriculum/update',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req, res) => {
      const { id, updates } = req.body;

      if (!id || !updates) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'INVALID_REQUEST').send(res);
         return;
      }

      if (isNaN(id)) {
         new ErrorResponseServerAPI('Param "id" must be a number', 400, 'INVALID_CV_ID').send(res);
         return;
      }

      try {
         const cvId = Number(id);
         const updated = await CV.update(cvId, updates);

         if (!updated) {
            new ErrorResponseServerAPI('CV not found or update failed', 404, 'CV_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error) {
         console.error('Error updating curriculum:', error);
         new ErrorResponseServerAPI('Failed to update curriculum', 500, 'CURRICULUM_UPDATE_ERROR').send(res);
      }
   }
});
