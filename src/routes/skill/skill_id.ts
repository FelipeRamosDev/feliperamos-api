import { Skill } from '../../database/models/skills_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'GET',
   routePath: '/skill/:skill_id',
   controller: async (req: Request, res: Response) => {
      const { skill_id } = req.params;
      const skillId = Number(skill_id);

      if (!skillId) {
         new ErrorResponseServerAPI('Skill ID is required', 400, 'SKILL_ID_REQUIRED').send(res);
         return;
      }

      try {
         const skill = await Skill.getFullSet(Number(skillId));
         
         if (!skill) {
            new ErrorResponseServerAPI('Skill not found', 404, 'SKILL_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(skill)
      } catch (error) {
         console.error("Error in skill details route:", error);
         new ErrorResponseServerAPI('Internal Server Error', 500, '').send(res);
      }
   }
});
