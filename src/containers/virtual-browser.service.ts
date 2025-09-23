import 'dotenv/config';

import VirtualBrowser from '../services/VirtualBrowser';
import cvCreatePdfRoute from './routes/virtual-browser/cv-create-pdf.route';
import cvDeletePdfRoute from './routes/virtual-browser/cv-delete-pdf.route';
import linkedInJobDescription from './routes/virtual-browser/linkedin/job-infos.route';
import letterCreatePDF from './routes/virtual-browser/letter/create-pdf.route';
import letterDeletePDF from './routes/virtual-browser/letter/delete-pdf.route';


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
