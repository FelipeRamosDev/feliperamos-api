import { EventEndpoint } from '../../../../services';
import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';
import { deleteFile } from '../../../../helpers/fs.helpers';
import { Letter } from '../../../../database/models/letters_schema';

export default new EventEndpoint({
   path: '/virtual-browser/letter/delete-pdf',
   controller: async (params = {}, done = () => {}) => {
      const { letter_id, userFullName, language_set } = params;
      
      try {
         const pdfPath = Letter.letterPdfPath(userFullName, letter_id, language_set);
         const deleted = await deleteFile(pdfPath);

         if (!deleted) {
            return done(new ErrorEventEndpoint('Failed to delete CV PDF', 'CV_DELETE_PDF_ERROR'));
         }

         done({ success: true });
      } catch (error) {
         console.error('Error deleting CV PDF:', error);
         return done(new ErrorEventEndpoint('Failed to delete CV PDF', 'CV_DELETE_PDF_ERROR'));
      }
   }
});
