import { Letter } from '../../database/models/letters_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   routePath: '/cover-letter/search',
   method: 'GET',
   allowedRoles: ['admin', 'master'],
   useAuth: true, 
   controller: async (req, res) => {
      const { query } = req.query;
      const queryObj = query ? JSON.parse(query as string) : {};
      const userId = req.session.user?.id;

      try {
         const letters = await Letter.find({ ...queryObj, from_id: userId  });
         res.status(200).send(letters);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Failed to fetch cover letters', 500, 'FAILED_TO_FETCH_COVER_LETTERS').send(res);
      }
   }
});
