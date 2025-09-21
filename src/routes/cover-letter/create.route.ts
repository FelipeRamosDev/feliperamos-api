import { Letter } from '../../database/models/letters_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   routePath: '/cover-letter/create',
   method: 'POST',
   allowedRoles: ['admin', 'master'],
   useAuth: true,
   controller: async (req, res) => {
      const { type, subject, body, opportunity_id, company_id } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
         new ErrorResponseServerAPI('Unauthorized user!', 401, 'UNAUTHORIZED').send(res);
         return;
      }

      try {
         const letter = new Letter({
            from_id: userId,
            type,
            subject,
            body,
            opportunity_id,
            company_id
         });

         const created = await letter.save();
         res.status(201).send(created);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Failed to create cover letter', 500, error.code || 'INTERNAL_SERVER_ERROR').send(res);
      }
   }
})
