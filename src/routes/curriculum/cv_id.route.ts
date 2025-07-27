import CV from '../../database/models/curriculums_schema/CV/CV';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/curriculum/:cv_id',
   controller: async (req, res) => {
      const { cv_id } = req.params || {};

      if (!cv_id) {
         new ErrorResponseServerAPI('CV ID is required', 400, 'CV_ID_REQUIRED').send(res);
         return;
      }

      if (isNaN(Number(cv_id))) {
         new ErrorResponseServerAPI('Invalid CV ID format', 400, 'CV_ID_INVALID').send(res);
         return;
      }

      try {
         const cvId = Number(cv_id);
         const cv = await CV.getFullById(cvId);

         if (!cv) {
            new ErrorResponseServerAPI('CV not found', 404, 'CV_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(cv);
      } catch (error) {
         console.error('Error fetching CV:', error);
         new ErrorResponseServerAPI('Failed to fetch CV', 500, 'CV_FETCH_ERROR').send(res);
      }
   }
});
