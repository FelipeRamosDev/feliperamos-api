export interface EducationSetSetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   degree?: string;
   field_of_study?: string;
   grade?: string;
   description?: string;
   education_id: number;
   language_set: string;
   user_id: number;
}

export interface EducationSetCreate {
   degree?: string;
   field_of_study?: string;
   grade?: string;
   description?: string;
   education_id: number;
   user_id: number;
   language_set: string;
}
