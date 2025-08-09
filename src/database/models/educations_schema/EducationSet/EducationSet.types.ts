export interface EducationSetSetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   degree?: string;
   field_of_study?: string;
   grade?: string | null;
   description?: string | null;
   education_id: number;
   user_id: number;
}
