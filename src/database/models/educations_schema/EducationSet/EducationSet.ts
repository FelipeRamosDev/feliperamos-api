import TableRow from '../../../../services/Database/models/TableRow';
import { EducationSetSetup } from './EducationSet.types';

class EducationSet extends TableRow {
   public degree?: string;
   public field_of_study?: string;
   public grade?: string | null;
   public description?: string | null;
   public education_id: number;
   public user_id: number;

   constructor(setup: EducationSetSetup, schemaName: string = 'educations_schema', tableName: string = 'education_sets') {
      super(schemaName, tableName, setup);
      const { degree, field_of_study, grade, description, education_id, user_id } = setup || {};

      this.degree = degree;
      this.field_of_study = field_of_study;
      this.grade = grade;
      this.description = description;
      this.education_id = education_id;
      this.user_id = user_id;
   }
}

export default EducationSet;
