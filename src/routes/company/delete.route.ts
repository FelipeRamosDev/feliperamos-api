import { Company } from '../../database/models/companies_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/company/delete',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { companyId } = req.body;

      if (!companyId) {
         new ErrorResponseServerAPI('Company ID is required', 400, 'ERROR_COMPANY_ID_REQUIRED').send(res);
         return;
      }

      try {
         const deleted = await Company.delete(companyId);

         if (!deleted) {
            new ErrorResponseServerAPI('Company not found or could not be deleted', 404, 'ERROR_COMPANY_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(deleted);
      } catch (error) {
         console.error('Error deleting company:', error);
         new ErrorResponseServerAPI('Failed to delete company', 500, 'ERROR_COMPANY_DELETE').send(res);
      }
   }
});
