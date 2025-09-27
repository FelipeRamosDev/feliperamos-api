import { Opportunity } from "../../database/models/opportunities_schema";
import { Route } from "../../services";
import ErrorResponseServerAPI from "../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'PATCH',
   routePath: '/opportunity/update',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      try {
         const { id, updates } = req.body;
         const opportunityId = Number(id);

         if (!id || isNaN(opportunityId)) {
            new ErrorResponseServerAPI('Opportunity ID is required', 400, 'BAD_REQUEST').send(res);
            return;
         }

         // Find the opportunity by ID
         const opportunity = await Opportunity.update(opportunityId, updates);

         await opportunity?.populateCV();
         await opportunity?.populateCompany();

         res.status(200).send(opportunity);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || '', error.code || 'UPDATE_OPPORTUNITY_ERROR').send(res)
      }
   }
});
