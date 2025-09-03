import { Experience } from '../../database/models/experiences_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'DELETE',
   routePath: '/experience/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { experienceId } = req.query;
      const experienceIdNumber = Number(experienceId);

      if (!experienceIdNumber || isNaN(experienceIdNumber)) {
         new ErrorResponseServerAPI('Experience ID is required', 400, 'ERROR_EXPERIENCE_ID_REQUIRED').send(res);
         return;
      }

      try {
         const deleted = await Experience.delete(experienceIdNumber);

         if (!deleted) {
            new ErrorResponseServerAPI('Experience not found or could not be deleted', 404, 'ERROR_EXPERIENCE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(deleted);
      } catch (error) {
         console.error('Error deleting experience:', error);
         new ErrorResponseServerAPI('Failed to delete experience', 500, 'ERROR_EXPERIENCE_DELETE').send(res);
      }
   }
});
