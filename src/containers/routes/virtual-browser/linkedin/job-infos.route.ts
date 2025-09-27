import ErrorEventEndpoint from '../../../../services/EventEndpoint/ErrorEventEndpoint';
import { EventEndpoint } from '../../../../services';
import service from '../../../virtual-browser.service';

const LOGIN_MODAL_SELECTOR = '#base-contextual-sign-in-modal';
const LOGIN_MODAL_CLOSE_BUTTON_SELECTOR = `${LOGIN_MODAL_SELECTOR} .contextual-sign-in-modal__modal-dismiss`;
const SHOW_MORE_BUTTON_SELECTOR = '.show-more-less-html__button';
const JOB_COMPANY_NAME = '.topcard__org-name-link';
const JOB_TITLE_SELECTOR = '.top-card-layout__title';
const JOB_DESCRIPTION_SELECTOR = '.description__text';
const JOB_LOCATION_SELECTOR = '.top-card-layout__second-subline .topcard__flavor-row .topcard__flavor:nth-child(2)';
const JOB_SENIORITY_SELECTOR = '.description__job-criteria-item:nth-child(1) .description__job-criteria-text--criteria';
const JOB_EMPLOYMENT_TYPE_SELECTOR = '.description__job-criteria-item:nth-child(2) .description__job-criteria-text--criteria';

export default new EventEndpoint({
   path: '/virtual-browser/linkedin/job-infos',
   controller: async (params = {}, done = () => {}) => {
      const { jobURL } = params || {};
      const pageName = `linkedin-job-${jobURL}`;

      if (!jobURL) {
         return done(new ErrorEventEndpoint('Job URL is required', 'JOB_URL_REQUIRED'));
      }

      try {
         const page = await service.newPage(pageName, jobURL);

         const loginModal = await page.getElement(LOGIN_MODAL_SELECTOR);
         const isLoginModalVisible = await loginModal?.isVisible();

         if (isLoginModalVisible) {
            await page.click(LOGIN_MODAL_CLOSE_BUTTON_SELECTOR);
         }

         // Clicking on the "see more" button
         await page.click(SHOW_MORE_BUTTON_SELECTOR);

         const jobCompanyElm = await page.getElement(JOB_COMPANY_NAME);
         const jobCompany = await jobCompanyElm?.evaluate((el) => (el as HTMLElement)?.innerText);

         const jobTitleElm = await page.getElement(JOB_TITLE_SELECTOR);
         const jobTitle = await jobTitleElm?.evaluate((el) => (el as HTMLElement)?.innerText);

         const descr = await page.getElement(JOB_DESCRIPTION_SELECTOR);
         const jobDescription = await descr?.evaluate((el) => (el as HTMLElement)?.innerText);

         const location = await page.getElement(JOB_LOCATION_SELECTOR);
         const jobLocation = await location?.evaluate((el) => (el as HTMLElement)?.innerText);
         
         const seniority = await page.getElement(JOB_SENIORITY_SELECTOR);
         const jobSeniority = await seniority?.evaluate((el) => (el as HTMLElement)?.innerText);

         const employmentType = await page.getElement(JOB_EMPLOYMENT_TYPE_SELECTOR);
         const jobEmploymentType = await employmentType?.evaluate((el) => (el as HTMLElement)?.innerText);

         page.close().catch(err => console.error('Error closing page:', err));

         done({
            jobCompany: (jobCompany || '').trim(),
            jobTitle: (jobTitle || '').trim(),
            jobDescription: (jobDescription || '').trim(),
            jobLocation: (jobLocation || '').trim(),
            jobSeniority: (jobSeniority || '').trim(),
            jobEmploymentType: (jobEmploymentType || '').trim(),
         });
      } catch (error: any) {
         service.closePage(pageName).catch(err => console.error('Error closing page:', err));
         done(new ErrorEventEndpoint(error.message || 'Error fetching job description from LinkedIn URL!', error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'));
      }
   }
});