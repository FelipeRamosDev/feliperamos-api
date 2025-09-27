import { EventEndpoint } from '../../../../services';
import service from '../../../../containers/virtual-browser.service';
import { frontendURL } from '../../../../helpers/parse.helper';
import { Letter } from '../../../../database/models/letters_schema';
import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';

export default new EventEndpoint({
   path: '/virtual-browser/letter/create-pdf',
   controller: async (params = {}, done = () => { }) => {
      const { letter_id, language_set = 'en' } = params;
      const pageId = `letter-pdf-${letter_id}-${language_set}`;
      const pageURL = frontendURL(`/${language_set}/pdf/letter/${letter_id}`);

      if (!letter_id) {
         return done(new ErrorEventEndpoint('Letter ID is required', 'LETTER_ID_REQUIRED'));
      }

      try {
         const existingPage = service.getPage(pageId);

         if (existingPage) {
            await existingPage.close();
         }

         const page = await service.newPage(pageId, pageURL);
         if (!page) {
            return done(new ErrorEventEndpoint('Failed to create PDF template page!', 'PAGE_CREATION_FAILED'));
         }

         const letter = await Letter.findById(letter_id);
         if (!letter) {
            return done(new ErrorEventEndpoint('Letter not found', 'LETTER_NOT_FOUND'));
         }

         if (!letter.pdfPath || typeof letter.pdfPath !== 'string' || letter.pdfPath.trim() === '') {
            return done(new ErrorEventEndpoint('Invalid PDF path', 'INVALID_PDF_PATH'));
         }

         const pdfBuffer = await page.toPDF(letter.pdfPath);
         if (!pdfBuffer) {
            return done(new ErrorEventEndpoint('Failed to generate PDF buffer', 'PDF_BUFFER_GENERATION_FAILED'));
         }

         await page.close();
         return done({ success: true });
      } catch (error) {
         done(new ErrorEventEndpoint('An error occurred while creating the PDF', 'PDF_CREATION_ERROR'));
      }
   }
});
