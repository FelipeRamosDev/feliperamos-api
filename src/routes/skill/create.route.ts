import { Skill } from '../../database/models/skills_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'POST',
   routePath: '/skill/create',
   useAuth: true,
   allowedRoles: [ 'master', 'admin' ],
   controller: async (req: Request, res: Response): Promise<void> => {
      const { name, journey, category, level, language_set } = req.body || {};
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      try {
         const newSkill = await Skill.create({
            user_id: userId,
            name,
            journey,
            category,
            level,
            language_set: language_set
         });

         if (!newSkill) {
            new ErrorResponseServerAPI('Skill creation failed').send(res);
            return;
         }

         res.status(201).send(newSkill);
      } catch (error) {
         console.error('Error creating skill:', error);
         new ErrorResponseServerAPI().send(res);
      }
   }
});
