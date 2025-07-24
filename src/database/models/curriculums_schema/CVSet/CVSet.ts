import TableRow from '../../../../services/Database/models/TableRow';
import { CVSetSetup } from './CVSet.types';

export default class CVSet extends TableRow {
   user_id?: number | null;
   professional_title: string;
   brief_bio: string;
   cv_id: number;

   constructor(setup: CVSetSetup, schemaName: string = 'curriculums_schema', tableName: string = 'cv_sets') {
      super(schemaName, tableName, setup);

      const {
         professional_title = '',
         brief_bio = '',
         user_id,
         cv_id
      } = setup || {};

      this.professional_title = professional_title;
      this.brief_bio = brief_bio;
      this.user_id = user_id;
      this.cv_id = cv_id;
   }
}
