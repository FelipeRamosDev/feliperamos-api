import { Company } from "../../database/models/companies_schema";
import { Route } from "../../services";
import ErrorResponseServerAPI from "../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'POST',
   routePath: '/company/update',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { id, updates } = Object(req.body);

      if (!id || !updates) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'INVALID_REQUEST').send(res);
         return;
      }

      try {
         const updatedCompany = await Company.update(id, updates);

         if (!updatedCompany) {
            new ErrorResponseServerAPI('Company not found', 404, 'COMPANY_NOT_FOUND').send(res);
            return;
         }
         
         res.status(200).send(updatedCompany);
      } catch (error) {
         new ErrorResponseServerAPI('Error updating company', 500, 'COMPANY_UPDATE_ERROR').send(res);
      }
   }
});
