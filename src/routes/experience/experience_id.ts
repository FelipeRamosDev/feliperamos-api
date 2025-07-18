import { Experience } from '../../database/models/experiences_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/experience/:experience_id',
   controller: async (req, res) => {
      const { experience_id } = req.params;
      const experienceId = parseInt(experience_id, 10);

      if (isNaN(experienceId)) {
         new ErrorResponseServerAPI('Invalid experience ID', 400, 'INVALID_EXPERIENCE_ID').send(res);
         return;
      }

      try {
         const experience = await Experience.getFullSet(experienceId);
         if (!experience) {
            new ErrorResponseServerAPI('Experience not found', 404, 'EXPERIENCE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(experience);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to fetch Experience!', 500, 'EXPERIENCE_QUERY_ERROR').send(res);
      }
   }
});
