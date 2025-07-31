import 'dotenv/config';
import VirtualBrowser from '../services/VirtualBrowser';
import cvCreatePdfRoute from './routes/virtual-browser/cv-create-pdf.route';

export default new VirtualBrowser({
   autoInit: true,
   endpoints: [ cvCreatePdfRoute ],
   async onInit(virtualBrowser) {
      console.log('[virtual-browser] Virtual Browser service initialized successfully!');
   },
   onError(error) {
      console.error('[virtual-browser] Virtual Browser service error:', error);
   },
});
