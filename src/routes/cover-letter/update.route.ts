import { Letter } from '../../database/models/letters_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'PATCH',
   routePath: '/cover-letter/update/:id',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   async controller(req, res) {
      const { id } = req.params;
      const data = req.body;
      const letterId = Number(id);

      if (!data || !Object.keys(data).length) {
         new ErrorResponseServerAPI('No data provided for update', 400, 'NO_DATA_PROVIDED').send(res);
         return;
      }

      if (isNaN(letterId)) {
         new ErrorResponseServerAPI('Invalid Letter ID', 400, 'INVALID_LETTER_ID').send(res);
         return;
      }
      
      try {
         const updated = await Letter.update(letterId, data);

         if (!updated) {
            new ErrorResponseServerAPI('Letter not found', 404, 'LETTER_NOT_FOUND').send(res);
            return;
         }

         res.status(200).send(updated);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Failed to update cover letter', error.status || 500, error.code || 'ERROR_UPDATE_COVER_LETTER').send(res);
      }
   },
});
