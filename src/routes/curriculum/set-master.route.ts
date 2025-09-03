import CV from '../../database/models/curriculums_schema/CV/CV';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'PATCH',
   routePath: '/curriculum/set-master',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const userId = req.session?.user?.id;
      const { cv_id } = req.body;

      if (!userId) {
         new ErrorResponseServerAPI('User ID is required.', 400, 'ERR_MISSING_USER_ID').send(res);
         return;
      }

      if (!cv_id) {
         new ErrorResponseServerAPI('CV ID is required.', 400, 'ERR_MISSING_CV_ID').send(res);
         return;
      }

      try {
         const updatedMaster = await CV.setUserMasterCV(cv_id, userId);
         if (!updatedMaster) {
            new ErrorResponseServerAPI('CV not found or already set as master.', 404, 'ERR_CV_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updatedMaster);
      } catch (error) {
         console.error('Error setting master:', error);
         new ErrorResponseServerAPI('Failed to set CV as master.', 500, 'ERR_SET_MASTER').send(res);
      }
   }
});
