import { CompanySet } from '../../database/models/companies_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'PATCH',
   routePath: '/company/update-set',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req: Request, res: Response) => {
      const { id, updates } = Object(req.body);

      if (!id || !updates || !Object.keys(updates).length) {
         new ErrorResponseServerAPI('Invalid request data', 400, 'COMPANY_SET_UPDATE_ERROR').send(res);
         return;
      }

      try {
         const updatedSet = await CompanySet.updateSet(id, updates);

         if (!updatedSet) {
            new ErrorResponseServerAPI('Failed to update company set', 400, 'COMPANY_SET_UPDATE_ERROR').send(res);
            return;
         }

         res.status(200).send(updatedSet);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, 'COMPANY_SET_UPDATE_ERROR').send(res);
      }
   }
});
