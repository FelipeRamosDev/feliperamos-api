import { ExperienceSet } from '../../database/models/experiences_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/experience/update-set',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { id, updates } = req.body;

      if (!id || !updates) {
         new ErrorResponseServerAPI('Missing "id" or "updates"', 400, 'MISSING_PARAMS').send(res);
         return;
      }

      try {
         const updated = await ExperienceSet.update(id, updates);

         if (!updated) {
            new ErrorResponseServerAPI('Experience set not found or update failed', 404, 'UPDATE_FAILED').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error: any) {
         console.error('Error updating experience set:', error);
         new ErrorResponseServerAPI('Failed to update experience set', 500, 'UPDATE_FAILED').send(res);
      }
   }
});
