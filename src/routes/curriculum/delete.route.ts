import { CV } from '../../database/models/curriculums_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'DELETE',
   routePath: '/curriculum/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { cvId } = req.query;
      const cvIdNumber = Number(cvId);

      if (!cvIdNumber || isNaN(cvIdNumber)) {
         new ErrorResponseServerAPI('CV ID is required', 400, 'ERROR_CV_ID_REQUIRED').send(res);
         return;
      }

      try {
         const deleted = await CV.delete(cvIdNumber);

         if (!deleted) {
            new ErrorResponseServerAPI('CV not found or could not be deleted', 404, 'ERROR_CV_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(deleted);
      } catch (error) {
         console.error('Error deleting CV:', error);
         new ErrorResponseServerAPI('Failed to delete CV', 500, 'ERROR_CV_DELETE').send(res);
      }
   }
});
