import { Company } from '../../database/models/companies_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/company/:company_id',
   controller: async (req, res) => {
      const { company_id } = req.params;
      const companyId = parseInt(company_id, 10);

      if (isNaN(companyId) || companyId < 0) {
         new ErrorResponseServerAPI('Invalid company ID', 400, 'INVALID_COMPANY_ID').send(res);
         return;
      }

      try {
         const company = await Company.getFullSet(companyId);

         if (!company) {
            new ErrorResponseServerAPI('Company not found', 404, 'COMPANY_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(company);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to fetch Company!', 500, 'COMPANY_QUERY_ERROR').send(res);
      }
   }
});
