import { CV } from '../../../database/models/curriculums_schema';
import { locales } from '../../../app.config';
import { sendToCreateCVPDF, sendToDeleteCVPDF } from '../../../helpers/database.helper';
import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'cvs',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'experience_time', type: 'DECIMAL(2,1)' },
      { name: 'is_master', type: 'BOOLEAN', defaultValue: false },
      { name: 'notes', type: 'TEXT' },
      { name: 'cv_experiences', type: 'INTEGER[]' },
      { name: 'cv_skills', type: 'INTEGER[]' },
      { name: 'cv_owner_id', type: 'INTEGER' },
   ],
   events: {
      onAfterUpdate(query) {
         const responseData = query.firstRow;

         if (!responseData) {
            return;
         }

         locales.forEach((language_set) => {
            sendToCreateCVPDF({ cv_id: responseData.id, language_set });
         });
      },
      async onAfterDelete(query) {
         const responseData = query.firstRow;

         if (!responseData) {
            return;
         }

         const cv = new CV(responseData);

         await cv.populateUser();
         locales.forEach((language_set) => {
            sendToDeleteCVPDF(responseData.id, language_set, cv.user?.name);
         });
      }
   }
});
