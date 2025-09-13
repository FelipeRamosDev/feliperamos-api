import { Opportunity } from '../../database/models/opportunities_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'DELETE',
   routePath: '/opportunity/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { id, deleteRelated } = req.body;
      const userID = req.session.user?.id;

      if (!userID) {
         new ErrorResponseServerAPI('User ID is required', 400, 'MISSING_USER_ID').send(res);
         return;
      }

      if (!id) {
         new ErrorResponseServerAPI('Opportunity ID is required', 400, 'MISSING_OPPORTUNITY_ID').send(res);
         return;
      }

      if (isNaN(id)) {
         new ErrorResponseServerAPI('Invalid opportunity ID', 400, 'INVALID_OPPORTUNITY_ID').send(res);
         return;
      }

      try {
         const deleted = await Opportunity.delete(id, userID, deleteRelated);

         if (!deleted) {
            new ErrorResponseServerAPI('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND').send(res);
            return;
         }

         res.status(204).send(deleted);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Failed to delete opportunity', 500, error.code || '').send(res);
      }
   }
});
