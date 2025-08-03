import { defaultLocale } from '../../../app.config';
import { cvPdfPath } from '../../../helpers/parse.helper';
import { EventEndpoint } from '../../../services';
import ErrorEventEndpoint from '../../../services/EventEndpoint/ErrorEventEndpoint';
import { deleteFile } from '../../../helpers/fs.helpers';

export default new EventEndpoint({
   path: '/virtual-browser/cv-delete-pdf',
   controller: async (params = {}, done = () => {}) => {
      const { cv_id, language_set = defaultLocale, userFullName } = params;
      
      try {
         const pdfPath = cvPdfPath(userFullName, cv_id, language_set);
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
