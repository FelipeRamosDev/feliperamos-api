import { EventEndpoint } from '../../../services';
import { cvPdfPath, frontendURL } from '../../../helpers/parse.helper';
import { CV } from '../../../database/models/curriculums_schema';
import service from '../../../containers/virtual-browser.service';
import { defaultLocale } from '../../../app.config';

export default new EventEndpoint({
   path: '/virtual-browser/cv-create-pdf',
   controller: async (params = {}, done = () => {}) => {
      const { cv_id, language_set = defaultLocale } = params;
      let cv: CV | undefined;

      if (!cv_id) {
         return done(new EventEndpoint.Error('CV ID is required', 'CV_ID_REQUIRED'));
      }

      try {
         const loadedCV = await CV.getById(cv_id, language_set);

         if (!loadedCV) {
            return done(new EventEndpoint.Error('CV not found', 'CV_NOT_FOUND'));
         }

         cv = loadedCV;
      } catch (error: any) {
         return done(new EventEndpoint.Error(error.message, error.code || ''));
      }

      try {
         const pageId = `cv-pdf-${cv_id}-${language_set}`;
         const page = await service.newPage(pageId, frontendURL(`/${language_set}/curriculum/pdf/${cv_id}`));
         if (!page) {
            return done(new EventEndpoint.Error('Failed to create PDF template page!', 'PAGE_CREATION_FAILED'));
         }

         const pdfPath = cvPdfPath(cv.user.name, Number(cv.id), language_set);
         const pdfBuffer = await page.toPDF(pdfPath, {
            printBackground: true
         });

         if (!pdfBuffer) {
            return done(new EventEndpoint.Error('Failed to generate PDF', 'PDF_GENERATION_FAILED'));
         }

         await page.close();
         return done({ success: true });
      } catch (error: any) {
         const err = new EventEndpoint.Error(error.message, error.code || 'CV_CREATE_PDF_ERROR');
         return done(err);
      }
   }
});
