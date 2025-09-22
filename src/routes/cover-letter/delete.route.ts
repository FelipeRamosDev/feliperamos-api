import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';
import { Route } from '../../services';
import { Letter } from '../../database/models/letters_schema';

export default new Route({
   method: 'DELETE',
   routePath: '/cover-letter/delete/:id',
   useAuth: true,
   allowedRoles: ['admin', 'master'],
   async controller(req, res) {
      const { id } = req.params;
      const letterId = Number(id);

      if (!id) {
         new ErrorResponseServerAPI('Missing cover letter ID', 400, 'ERROR_MISSING_ID').send(res);
         return;
      }

      if (isNaN(letterId)) {
         new ErrorResponseServerAPI('Invalid cover letter ID', 400, 'ERROR_INVALID_ID').send(res);
         return;
      }

      try {
         const deleted = await Letter.delete(letterId);

         if (!deleted) {
            new ErrorResponseServerAPI('Cover letter not found', 404, 'ERROR_COVER_LETTER_NOT_FOUND').send(res);
            return;
         }

         res.status(204).send(deleted);
      } catch (error) {
         new ErrorResponseServerAPI('Failed to delete cover letter', 500, 'ERROR_DELETING_COVER_LETTER').send(res);
         return;
      }
   },
});
