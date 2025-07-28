import { AdminUser } from '../../database/models/users_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/user/update',
   controller: async (req, res) => {
      const { updates } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User ID is required', 400, 'USER_ID_REQUIRED').send(res);
         return;
      }

      try {
         const updatedUser = await AdminUser.update(userId, updates);

         if (!updatedUser) {
            new ErrorResponseServerAPI();
         }

         req.session.user = updatedUser.toPublic();
         res.status(200).send(updatedUser);
      } catch (error) {
         console.error('Error updating user:', error);
         new ErrorResponseServerAPI('Failed to update user', 500, 'USER_UPDATE_FAILED').send(res);
      }
   }
});
