import ErrorDatabase from '../../../services/Database/ErrorDatabase';
import Table from '../../../services/Database/models/Table';
import { ExperienceSet } from '../../../database/models/experiences_schema';
import { sendToCreateCVPDF } from '../../../helpers/database.helper';
import { defaultLocale } from '../../../app.config';

export default new Table({
   name: 'experience_sets',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'slug', type: 'VARCHAR(255)', notNull: true },
      { name: 'position', type: 'VARCHAR(50)', notNull: true },
      { name: 'language_set', type: 'VARCHAR(2)', defaultValue: defaultLocale },
      { name: 'summary', type: 'TEXT', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'responsibilities', type: 'TEXT' },
      {
         name: 'experience_id',
         type: 'INTEGER',
         notNull: true,
         relatedField: {
            schema: 'experiences_schema',
            table: 'experiences',
            field: 'id'
         }
      },
      {
         name: 'user_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'users_schema',
            table: 'admin_users',
            field: 'id'
         }
      }
   ],
   events: {
      onAfterUpdate: async (query) => {
         try {
            const experienceSet = new ExperienceSet(query.firstRow);
            if (!experienceSet) {
               throw new ErrorDatabase('ExperienceSet not found for the given ID', 'EXPERIENCE_SET_NOT_FOUND');
            }

            const relatedCVs = await experienceSet.getSetRelatedCVs();
            relatedCVs.forEach((cv) => {
               sendToCreateCVPDF({ cv_id: cv.id, language_set: experienceSet.language_set });
            });
         } catch (error: any) {
            const err = new ErrorDatabase(error.message, error.code || 'EXPERIENCE_SET_UPDATE_EVENT_ERROR');
            console.error(err);
         }
      }
   }
});
