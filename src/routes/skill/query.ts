import { Skill } from '../../database/models/skills_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'GET',
   routePath: '/skill/query',
   useAuth: true,
   allowedRoles: [ 'master', 'admin' ],
   controller: async (req: Request, res: Response): Promise<void> => {
      const { language_set } = req.body || {};
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      try {
         const loadedSkills = await Skill.getSkillsByUserId(userId, language_set);
         res.status(200).send(loadedSkills);
      } catch (error) {
         console.error('Error creating skill:', error);
         new ErrorResponseServerAPI().send(res);
      }
   }
});
