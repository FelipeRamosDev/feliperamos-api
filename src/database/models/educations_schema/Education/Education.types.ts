import { EducationSetSetup } from '../EducationSet/EducationSet.types';

export interface EducationSetup extends EducationSetSetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   institution_name: string;
   start_date: Date;
   end_date: Date;
   is_current: boolean;
   student_id: number;
   resume_id: number;
}
