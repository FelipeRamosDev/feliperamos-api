import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Education } from '../../database/models/educations_schema';

export default new Route({
   method: 'GET',
   routePath: '/education/:education_id',
   controller: async (req, res) => {
      const { education_id } = req.params;
      const educationId = Number(education_id);

      if (!education_id) {
         new ErrorResponseServerAPI('Education ID is required', 400, 'EDUCATION_ID_REQUIRED').send(res);
         return;
      }

      if (isNaN(educationId)) {
         new ErrorResponseServerAPI('Education ID must be a number', 400, 'EDUCATION_ID_MUST_BE_NUMBER').send(res);
         return;
      }

      try {
         const educationRecord = await Education.getFullById(educationId);
         if (!educationRecord) {
            new ErrorResponseServerAPI('Education record not found', 404, 'EDUCATION_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(educationRecord);
      } catch (error) {
         new ErrorResponseServerAPI('Server error', 500, 'SERVER_ERROR').send(res);
      }
   }
});
