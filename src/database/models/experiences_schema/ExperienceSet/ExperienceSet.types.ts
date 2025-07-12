import TableRow from '@/services/Database/models/TableRow';

export interface ExperienceSetSetup extends TableRow {
   slug?: string;
   position?: string;
   language_set?: string;
   summary?: string;
   description?: string;
   responsibilities?: string;
   experience_id?: number;
}
