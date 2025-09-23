import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Opportunity } from '../../database/models/opportunities_schema';
import { Company } from '../../database/models/companies_schema';
import { defaultLocale } from '../../app.config';
import { CV } from '../../database/models/curriculums_schema';

export default new Route({
   method: 'POST',
   routePath: '/opportunity/create',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      const { jobURL, jobTitle, jobDescription, jobLocation, jobSeniority, jobEmploymentType, jobCompany, cvSummary, cvTemplate } = req.body;
      const userID = req.session.user?.id;

      if (!userID) {
         new ErrorResponseServerAPI('User not authenticated', 401, 'USER_NOT_AUTHENTICATED').send(res);
         return;
      }

      try {
         const template = await CV.getById(cvTemplate, defaultLocale);
         if (!template) {
            new ErrorResponseServerAPI('CV Template not found', 404, 'CV_TEMPLATE_NOT_FOUND').send(res);
            return;
         }

         const cv = await new CV({
            ...template.rawData,
            title: `${jobTitle} at ${jobCompany}`,
            job_title: jobTitle,
            summary: cvSummary,
            is_favorite: false,
            is_master: false,
         }).save();

         const company = await Company.create({
            company_name: jobCompany,
            user_id: userID,
            language_set: defaultLocale
         });

         const opportunity = new Opportunity({
            job_url: jobURL,
            job_title: jobTitle,
            job_description: jobDescription,
            location: jobLocation,
            seniority_level: jobSeniority,
            employment_type: jobEmploymentType,
            company_id: company.id,
            opportunity_user_id: userID,
            cv_id: cv.id
         });

         const saved = await opportunity.save();
         res.status(200).send(saved);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Error creating opportunity', 500, error.code || 'ERROR_CREATE_OPPORTUNITY').send(res);
      }
   }
});
