import EducationSet from '../EducationSet/EducationSet';
import { EducationSetup } from './Education.types';

class Education extends EducationSet {
   public institution_name: string;
   public start_date: Date;
   public end_date: Date;
   public is_current: boolean;
   public student_id: number;
   public resume_id: number;

   constructor(setup: EducationSetup) {
      super(setup, 'educations_schema', 'educations');
      const { institution_name, start_date, end_date, is_current, student_id, resume_id } = setup || {};

      this.institution_name = institution_name;
      this.start_date = start_date;
      this.end_date = end_date;
      this.is_current = is_current;
      this.resume_id = resume_id;
      this.student_id = student_id || this.user_id;
   }
}

export default Education;
