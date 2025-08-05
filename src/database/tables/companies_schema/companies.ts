import { sendToCreateCVPDF } from '../../../helpers/database.helper';
import { Company } from '../../../database/models/companies_schema';
import Table from '../../../services/Database/models/Table';
import { locales } from '../../../app.config';

export default new Table({
   name: 'companies',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'company_name', type: 'VARCHAR(255)', notNull: true },
      { name: 'location', type: 'VARCHAR(255)', notNull: true },
      { name: 'site_url', type: 'VARCHAR(255)' },
      { name: 'logo_url', type: 'VARCHAR(255)' },
   ],
   events: {
      onAfterUpdate: async (query) => {
         const updatedCompany = query.firstRow;
         
         try {
            const company = new Company(updatedCompany);
            const relatedCVs = await company.getRelatedCVs();

            relatedCVs.forEach((cv) => {
               locales.forEach((locale) => {
                  console.log(`PDF Request for the CV: ${cv.id} in locale: ${locale}`);
                  sendToCreateCVPDF({ cv_id: cv.id, language_set: locale });
               });
            });
         } catch (error) {
            console.error('Error in onAfterUpdate event:', error);
         }
      }
   }
});
