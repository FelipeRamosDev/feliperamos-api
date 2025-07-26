import { CompanySet } from '../../database/models/companies_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/company/create-set',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const newCompanySet = req.body;
      const userId = req.session.user?.id;

      if (!newCompanySet) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'COMPANY_SET_CREATE_ERROR').send(res);
         return;
      }

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'UNAUTHORIZED').send(res);
         return;
      }

      try {
         const newSet = await CompanySet.set({ ...newCompanySet, user_id: userId });

         if (!newSet) {
            new ErrorResponseServerAPI('Failed to create company set', 400, 'COMPANY_SET_CREATION_ERROR').send(res);
            return;
         }

         res.status(201).send(newSet);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to create company set', 500, 'COMPANY_SET_CREATE_ERROR').send(res);
      }
   }
});
