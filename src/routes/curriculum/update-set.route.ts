import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import CVSet from '../../database/models/curriculums_schema/CVSet/CVSet';

export default new Route({
   method: 'POST',
   routePath: '/curriculum/update-set',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req, res) => {
      const { id, updates } = req.body;

      if (!id || !updates || typeof updates !== 'object') {
         new ErrorResponseServerAPI('Missing required fields', 400, 'INVALID_REQUEST').send(res);
         return;
      }

      try {
         const updated = await CVSet.updateSet(id, updates);

         if (!updated) {
            new ErrorResponseServerAPI('Curriculum set not found or update failed', 404, 'CURRICULUM_SET_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error) {
         console.error('Error updating curriculum set:', error);
         new ErrorResponseServerAPI('Failed to update curriculum set', 500, 'SERVER_ERROR').send(res);
      }
   }
});
