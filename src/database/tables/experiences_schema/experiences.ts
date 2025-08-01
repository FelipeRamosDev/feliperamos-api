import ErrorDatabase from '../../../services/Database/ErrorDatabase';
import Table from '../../../services/Database/models/Table';
import { Experience } from '../../../database/models/experiences_schema';
import { sendToCreateCVPDF } from '../../../helpers/database.helper';
import { locales } from '../../../app.config';

export default new Table({
   name: 'experiences',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'type', type: 'VARCHAR(255)', notNull: true },
      { name: 'status', type: 'VARCHAR(255)', defaultValue: 'draft' },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      {
         name: 'company_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'companies_schema',
            table: 'companies',
            field: 'id'
         }
      },
      {
         name: 'skills',
         type: 'INTEGER[]'
      }
   ],
   events: {
      onAfterUpdate: async (query) => {
         const updated = query.firstRow;
         
         try {
            const experience = new Experience(updated);
            const relatedCVs = await experience.getRelatedCVs();

            relatedCVs.forEach((cv) => {
               locales.forEach((language_set) => {
                  sendToCreateCVPDF({ cv_id: cv.id, language_set });
               });
            });
         } catch (error: any) {
            const err = new ErrorDatabase(error.message, 'EXPERIENCE_UPDATE_EVENT_ERROR');
            console.error(err);
         }
      }
   }
});
