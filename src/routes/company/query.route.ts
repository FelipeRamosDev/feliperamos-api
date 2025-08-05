import { Request, Response } from 'express';
import { Route } from '../../services';
import { Company } from '../../database/models/companies_schema';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/company/query',
   useAuth: true,
   allowedRoles: [ 'admin', 'master' ],
   controller: async (req: Request, res: Response) => {
      const userId = req.session?.user?.id;
      const { language_set } = Object(req.query);

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated.', 401, 'UNAUTHORIZED').send(res);
         return;
      }

      try {
         const companies = await Company.query(userId, language_set);
         res.status(200).send(companies);
      } catch (error) {
         console.error('Error fetching companies:', error);
         new ErrorResponseServerAPI('Failed to fetch companies.', 500, 'INTERNAL_SERVER_ERROR').send(res);
      }
   }
});
