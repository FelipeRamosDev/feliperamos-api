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
      let { where, sort, order }: OpportunitySearchParams = req.query;
      const userID = req.session.user?.id;

      try {
         const results = await Opportunity.search({
            where: JSON.parse(where as string || '{}'),
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
