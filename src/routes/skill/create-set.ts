import SkillSet from '../../database/models/skills_schema/SkillSet/SkillSet';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/skill/create-set',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const skillData = req.body;
      const userId = req.session.user?.id;

      if (!skillData) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'INVALID_REQUEST_DATA').send(res);
         return;
      }

      try {
         const newSkillSet = await SkillSet.set({ ...skillData, user_id: userId });

         if (!newSkillSet) {
            new ErrorResponseServerAPI('Skill set creation failed', 500, 'SKILL_SET_CREATION_FAILED').send(res);
            return;
         }

         res.status(201).send(newSkillSet);
      } catch (error) {
         console.error('Error creating skill set:', error);
         new ErrorResponseServerAPI('Error creating skill set', 500, 'SKILL_SET_CREATION_FAILED').send(res);
      }
   }
});
