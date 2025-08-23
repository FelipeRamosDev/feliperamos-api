import 'dotenv/config';

import VirtualBrowser from '../services/VirtualBrowser';
import cvCreatePdfRoute from './routes/virtual-browser/cv-create-pdf.route';
import cvDeletePdfRoute from './routes/virtual-browser/cv-delete-pdf.route';
import linkedInJObDescription from './routes/virtual-browser/linkedin/job-description.route';

export default new VirtualBrowser({
   autoInit: true,
   endpoints: [
      cvCreatePdfRoute,
      cvDeletePdfRoute,
      linkedInJObDescription
   ],
   async onInit() {
      console.log('[virtual-browser] Virtual Browser service initialized successfully!');
   },
   onError(error) {
      console.error('[virtual-browser] Virtual Browser service error:', error);
   },
});
