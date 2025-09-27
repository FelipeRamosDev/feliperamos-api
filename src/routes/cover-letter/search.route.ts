import { LetterTypes } from '../../database/models/letters_schema/Letter/Letter.types';
import { Letter } from '../../database/models/letters_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   routePath: '/cover-letter/search/:id',
   method: 'GET',
   controller: async (req, res) => {
      const { id } = req.params;
      const userId = req.session.user?.id;
      const type = String(req.query['where[type]'] || 'cover-letter') as LetterTypes;

      try {
         if (id === 'all') {
            const letters = await Letter.find({ type, from_id: userId });
            res.status(200).send(letters);
         } else {
            const letterId = Number(id);
            const letter = await Letter.findById(letterId);
            res.status(200).send(letter);
         }
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message || 'Failed to fetch cover letters', 500, 'FAILED_TO_FETCH_COVER_LETTERS').send(res);
      }
   }
});
