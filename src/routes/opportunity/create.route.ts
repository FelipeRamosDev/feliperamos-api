import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Opportunity } from '../../database/models/opportunities_schema';
import { Company } from '../../database/models/companies_schema';
import { defaultLocale } from '../../app.config';

export default new Route({
   method: 'POST',
   routePath: '/opportunity/create',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      const { jobTitle, jobDescription, location, seniorityLevel, employmentType, companyName } = req.body;
      const userID = req.session.user?.id;

      if (!userID) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      try {
         const company = await Company.create({
            company_name: companyName,
            user_id: userID,
            language_set: defaultLocale
         });

         const opportunity = new Opportunity({
            job_title: jobTitle,
            job_description: jobDescription,
            location,
            seniority_level: seniorityLevel,
            employment_type: employmentType,
            company_id: company.id,
            opportunity_user_id: userID
         });

         const saved = await opportunity.save();
         res.status(200).send(saved);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Error creating opportunity', 500, error.code || 'ERROR_CREATE_OPPORTUNITY').send(res);
      }
   }
});
