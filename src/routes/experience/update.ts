import { Request, Response } from 'express';
import { Experience } from '../../database/models/experiences_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/experience/update',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req: Request, res: Response) => {
      const { experienceId, updates } = req.body;

      if (!experienceId || !updates) {
         new ErrorResponseServerAPI('Experience ID and updates are required.', 400, 'MISSING_PARAMETERS').send(res);
         return;
      }

      if (!Object.keys(updates).length) {
         new ErrorResponseServerAPI('No valid updates provided. The "updates" param is empty.', 400, 'INVALID_UPDATES').send(res);
         return;
      }

      try {
         const updatedExperience = await Experience.update(experienceId, updates);
         if (!updatedExperience) {
            new ErrorResponseServerAPI('Experience not found or update failed.', 404, 'EXPERIENCE_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updatedExperience);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to update experience.', 500, 'EXPERIENCE_UPDATE_ERROR').send(res);
      }
   }
});
