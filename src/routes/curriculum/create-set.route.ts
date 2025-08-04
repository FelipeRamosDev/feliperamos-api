import { defaultLocale } from '../../app.config';
import CVSet from '../../database/models/curriculums_schema/CVSet/CVSet';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/curriculum/create-set',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req, res) => {
      const { cv_id, job_title, sub_title, summary, language_set = defaultLocale } = req.body;
      const userId = req.session?.user?.id || 1;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated.', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      if (!cv_id) {
         new ErrorResponseServerAPI('CV ID is required.', 400, 'CV_ID_REQUIRED').send(res);
         return;
      }

      try {
         const newSet = await CVSet.createSet({
            cv_id,
            job_title,
            sub_title,
            summary,
            user_id: userId,
            language_set
         });

         res.status(201).send(newSet);
      } catch (error) {
         console.error('Error creating CV Set:', error);
         new ErrorResponseServerAPI('Failed to create CV Set.', 500, 'CV_SET_CREATE_ERROR').send(res);
      }
   },
});
