import { Skill } from '../../database/models/skills_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'PUT',
   routePath: '/skill/create',
   useAuth: true,
   allowedRoles: ['master', 'admin'],
   controller: async (req: Request, res: Response): Promise<void> => {
      const skillData = req.body;

      try {
         const newSkill = await Skill.create(skillData);
   
         res.status(201).send(newSkill);
      } catch (error) {
         new ErrorResponseServerAPI().send(res);
      }
   }
});
