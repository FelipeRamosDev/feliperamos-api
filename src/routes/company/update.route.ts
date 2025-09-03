import { Company } from "../../database/models/companies_schema";
import { Route } from "../../services";
import ErrorResponseServerAPI from "../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'PATCH',
   routePath: '/company/update',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req, res) => {
      const { id, updates } = req.body;

      try {
         const updatedCompany = await Company.update(id, updates);

         if (!updatedCompany) {
            new ErrorResponseServerAPI('Company not found', 404, 'COMPANY_NOT_FOUND').send(res);
         }
         
         res.status(200).send(updatedCompany);
      } catch (error) {
         new ErrorResponseServerAPI('Error updating company', 500, 'COMPANY_UPDATE_ERROR').send(res);
      }
   }
});
