import SkillSet from '../../database/models/skills_schema/SkillSet/SkillSet';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'POST',
   routePath: '/skill/update-set',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req: Request, res: Response) => {
      const { id, updates } = req.body;

      if (!id || !updates || !Object.keys(updates).length) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'INVALID_REQUEST_DATA').send(res);
         return;
      }

      try {
         const updatedSkillSet = await SkillSet.updateSet(id, updates);

         if (!updatedSkillSet) {
            new ErrorResponseServerAPI('Skill set not found or update failed', 404, 'SKILL_SET_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send({ message: 'Skill set updated successfully' });
      } catch (error) {
         console.error('Error updating skill set:', error);
         new ErrorResponseServerAPI('Error updating skill set').send(res);
      }
   }
});
