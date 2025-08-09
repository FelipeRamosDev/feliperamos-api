import { EducationSetSetup } from '../EducationSet/EducationSet.types';

export interface EducationSetup extends EducationSetSetup {
   institution_name: string;
   start_date: Date;
   end_date: Date;
   is_current: boolean;
   student_id: number;
   resume_id: number;
}
