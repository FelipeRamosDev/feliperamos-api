import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Opportunity } from '../../database/models/opportunities_schema';
import { OpportunitySearchParams } from '../../database/models/opportunities_schema/Opportunity/Opportunity.types';

export default new Route({
   method: 'GET',
   routePath: '/opportunity/search',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      let { sort, order }: OpportunitySearchParams = req.query;
      const userID = req.session.user?.id;
      const company_id = req.query['where[company_id]'];
      const where: Record<string, any> = {};

      try {
         if (company_id) {
            where.company_id = Number(company_id);
         }
         
         const results = await Opportunity.search({
            where,
            sort,
            order,
            userID
         });

         res.status(200).send(results);
      } catch (error) {
         new ErrorResponseServerAPI('Error fetching opportunities', 500, 'ERROR_FETCHING_OPPORTUNITIES').send(res);
      }
   }
});
