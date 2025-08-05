import { Skill } from '../../database/models/skills_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/skill/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { skillId } = req.body;

      if (!skillId) {
         new ErrorResponseServerAPI('Skill ID is required', 400, 'ERROR_SKILL_ID_REQUIRED').send(res);
         return;
      }

      try {
         const deleted = await Skill.delete(skillId);

         if (!deleted) {
            new ErrorResponseServerAPI('Skill not found or could not be deleted', 404, 'ERROR_SKILL_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(deleted);
      } catch (error) {
         console.error('Error deleting skill:', error);
         new ErrorResponseServerAPI('Failed to delete skill', 500, 'ERROR_SKILL_DELETE').send(res);
      }
   }
});
