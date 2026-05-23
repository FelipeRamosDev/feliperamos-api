import 'dotenv/config';

import VirtualBrowser from '../../services/VirtualBrowser';
import cvCreatePdfRoute from './events/cv-create-pdf.event';
import cvDeletePdfRoute from './events/cv-delete-pdf.event';
import linkedInJobDescription from './events/linkedin/job-infos.event';
import letterCreatePDF from './events/letter/create-pdf.event';
import letterDeletePDF from './events/letter/delete-pdf.event';


export default new VirtualBrowser({
   autoInit: true,
   endpoints: [
      cvCreatePdfRoute,
      cvDeletePdfRoute,
      letterCreatePDF,
      letterDeletePDF,
      linkedInJobDescription
   ],
   async onInit() {
      console.log('[virtual-browser] Virtual Browser service initialized successfully!');
   },
   onError(error) {
      console.error('[virtual-browser] Virtual Browser service error:', error);
   },
});
