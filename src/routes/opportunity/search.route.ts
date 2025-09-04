import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';

export default new Route({
   method: 'GET',
   routePath: '/opportunity/search',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      const { where } = req.query;
      const userID = req.session.user?.id;

      try {
         res.status(200).send([]);
      } catch (error) {
         new ErrorResponseServerAPI('Error fetching opportunities', 500, '').send(res);
      }
   }
});
