import { locales } from '../../../app.config';
import { Skill } from '../../../database/models/skills_schema';
import Table from '../../../services/Database/models/Table';
import { sendToCreateCVPDF } from '../../../helpers/database.helper';
import { CV } from '@/database/models/curriculums_schema';

export default new Table({
   name: 'skills',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'name', type: 'VARCHAR(255)', notNull: true },
      { name: 'category', type: 'VARCHAR(255)', notNull: true },
      { name: 'level', type: 'INTEGER', notNull: true }
   ],
   events: {
      onAfterUpdate: async (query) => {
         const updatedSkill = query.firstRow;
         if (!updatedSkill) {
            return;
         }

         try {
            const skill = new Skill(updatedSkill);
            const relatedCVs = await skill.getRelatedCVs();

            relatedCVs.forEach((cv: CV) => {
               locales.forEach(language_set => {
                  sendToCreateCVPDF({ cv_id: cv.id, language_set });
               });
            });
         } catch (error) {
            console.error('Error creating skill instance:', error);
         }
      }
   }
});
