import CV from '../../database/models/curriculums_schema/CV/CV';
import { CVSetup } from '../../database/models/curriculums_schema/CV/CV.types';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'POST',
   routePath: '/curriculum/create',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req: Request, res: Response) => {
      const {
         title,
         notes,
         cv_experiences = [],
         cv_educations = [],
         cv_languages = [],
         cv_skills = [],
         summary,
         is_master,
         job_title,
         sub_title,
         experience_time
      }: CVSetup = req.body;
      const userId = req.session?.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated.', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      if (!title) {
         new ErrorResponseServerAPI('Title is required.', 400, 'ROUTE_VALIDATION_ERROR').send(res);
         return;
      }

      try {
         const newCurriculum = new CV({
            title,
            notes,
            experience_time,
            cv_experiences,
            cv_educations,
            cv_languages,
            cv_skills,
            summary,
            job_title,
            sub_title,
            user_id: userId
         });

         const created = await newCurriculum.save();

         if (!created) {
            new ErrorResponseServerAPI('Failed to create curriculum', 500, 'CURRICULUM_CREATE_ERROR').send(res);
            return;
         }

         if (is_master && created.id && created.cv_owner_id) {
            const masterCV = await CV.setUserMasterCV(created.id, created.cv_owner_id);

            if (!masterCV) {
               new ErrorResponseServerAPI('Failed to set master CV', 500, 'CURRICULUM_MASTER_SET_ERROR').send(res);
               return;
            }
         }

         res.status(201).send(created);
      } catch (error) {
         console.error('Error creating curriculum:', error);
         new ErrorResponseServerAPI('Failed to create curriculum', 500, 'CURRICULUM_CREATE_ERROR').send(res);
      }
   }, 
});
