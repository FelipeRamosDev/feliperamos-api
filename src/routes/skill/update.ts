import Skill from '../../database/models/skills_schema/Skill/Skill';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'POST',
   routePath: '/skill/update',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req: Request, res: Response) => {
      const { id, updates } = req.body;

      if (!id || !updates) {
         new ErrorResponseServerAPI('Skill ID and updates are required.', 400, 'SKILL_ID_UPDATES_REQUIRED').send(res);
         return;
      }

      try {
         const updatedSkill = await Skill.update(id, updates);

         if (!updatedSkill) {
            new ErrorResponseServerAPI('Skill not found', 404, 'SKILL_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updatedSkill);
      } catch (error) {
         console.error('Error updating skill:', error);
         new ErrorResponseServerAPI('Error updating skill', 500, 'SKILL_UPDATE').send(res);
      }
   }
});
