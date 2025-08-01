import { CV } from '../../../database/models/curriculums_schema';
import Table from '../../../services/Database/models/Table';
import { locales } from '../../../app.config';
import { sendToCreateCVPDF } from '../../../helpers/database.helper';

export default new Table({
   name: 'admin_users',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'email', type: 'VARCHAR(255)', unique: true },
      { name: 'phone', type: 'VARCHAR(25)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'first_name', type: 'VARCHAR(255)' },
      { name: 'last_name', type: 'VARCHAR(255)' },
      { name: 'birth_date', type: 'DATE' },
      { name: 'country', type: 'VARCHAR(255)' },
      { name: 'state', type: 'VARCHAR(255)' },
      { name: 'city', type: 'VARCHAR(255)' },
      { name: 'role', type: 'VARCHAR(50)', defaultValue: 'admin' },
      { name: 'avatar_url', type: 'VARCHAR(255)' },
      { name: 'portfolio_url', type: 'VARCHAR(255)' },
      { name: 'github_url', type: 'VARCHAR(255)' },
      { name: 'linkedin_url', type: 'VARCHAR(255)' },
      { name: 'whatsapp_number', type: 'VARCHAR(255)' },
   ],
   events: {
      onAfterUpdate: async (query) => {
         const { id } = query.firstRow || {};

         if (!id) {
            return;
         }

         try {
            const userCVs = await CV.getUserCVs(id);

            userCVs.forEach((cv: CV) => {
               locales.forEach((language_set: string) => {
                  sendToCreateCVPDF({ cv_id: cv.id, language_set });
               });
            });
         } catch (error) {
            console.error('Error creating admin user instance:', error);
         }
      }
   }
});