import { Company } from '../../database/models/companies_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Request, Response } from 'express';

export default new Route({
   method: 'POST',
   routePath: '/company/create',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   controller: async (req: Request, res: Response) => {
      const { company_name, site_url, industry, description, logo_url, location } = req.body;
      const userId = req.session?.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('User not authenticated.', 401, 'UNAUTHORIZED').send(res);
         return;
      }

      try {
         if (!company_name || !industry || !location) {
            new ErrorResponseServerAPI('The fields "company_name", "industry", and "location" are required.', 400, 'MISSING_FIELDS').send(res);
            return;
         }

         const company = await Company.create({
            company_name,
            site_url,
            logo_url,
            industry,
            description,
            location,
            user_id: userId
         });

         if (!company) {
            new ErrorResponseServerAPI('Failed to create company.', 500, 'COMPANY_CREATION_FAILED').send(res);
            return;
         }

         res.status(201).send(company);
      } catch (error) {
         new ErrorResponseServerAPI().send(res);
      }
   }
});
