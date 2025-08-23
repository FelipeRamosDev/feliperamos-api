import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';
import { EventEndpoint } from '../../../../services';
import service from '../../../virtual-browser.service';

const LOGIN_MODAL_CLOSE_BUTTON_SELECTOR = '#base-contextual-sign-in-modal .contextual-sign-in-modal__modal-dismiss';
const SHOW_MORE_BUTTON_SELECTOR = '.show-more-less-html__button';
const JOB_DESCRIPTION_SELECTOR = '.description__text';

export default new EventEndpoint({
   path: '/virtual-browser/linkedin/job-description',
   controller: async (params = {}, done = () => {}) => {
      const { jobURL } = params || {};
      const pageName = `linkedin-job-${jobURL}`;

      if (!jobURL) {
         return done(new ErrorEventEndpoint('Job URL is required', 'JOB_URL_REQUIRED'));
      }

      try {
         const page = await service.newPage(pageName, jobURL);

         try {
            await page.click(LOGIN_MODAL_CLOSE_BUTTON_SELECTOR);
         } catch {
            // Continue any way because sometimes the login modal does not appear
         }

         // Clicking on the "see more" button
         await page.click(SHOW_MORE_BUTTON_SELECTOR);

         const descr = await page.getElement(JOB_DESCRIPTION_SELECTOR);
         const jobDescription = await descr?.evaluate((el) => (el as HTMLElement)?.innerText);

         page.close().catch(err => console.error('Error closing page:', err));
         done({ jobDescription: jobDescription || null });
      } catch (error: any) {
         service.closePage(pageName).catch(err => console.error('Error closing page:', err));
         done(new ErrorEventEndpoint(error.message || 'Error fetching job description from LinkedIn URL!', error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'));
      }
   }
});