import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Education } from '../../database/models/educations_schema';
import { Route } from '../../services';

export default new Route({
   method: 'DELETE',
   routePath: '/education/delete',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req, res) => {
      const { education_id } = req.body;
      const educationId = Number(education_id);

      if (!education_id) {
         new ErrorResponseServerAPI('Education ID is required', 400, 'ERR_INVALID_INPUT').send(res);
         return;
      }

      if (isNaN(educationId) || educationId <= 0) {
         new ErrorResponseServerAPI('Invalid Education ID', 400, 'ERR_INVALID_INPUT').send(res);
         return;
      }

      try {
         const deleted = await Education.delete(educationId);

         if (!deleted) {
            new ErrorResponseServerAPI('Education not found', 404, 'ERR_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send({ message: 'Education deleted successfully' });
      } catch (error: any) {
         new ErrorResponseServerAPI('Failed to delete education record', 500, 'ERR_DELETE_FAILED').send(res);
      }
   }
});
