import { Experience } from '../../database/models/experiences_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/experience/:experience_id',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { experience_id } = req.params;
      const experienceId = Number(experience_id);

      try {
         const experience = await Experience.getFullSet(experienceId);
         if (!experience) {
            new ErrorResponseServerAPI('Experience not found', 404, 'EXPERIENCE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(experience);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to fetch Experience!', 404, 'EXPERIENCE_QUERY_ERROR').send(res);
      }
   }
});
