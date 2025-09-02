import { CompanySetup } from "../../companies_schema/Company/Company.types";
import { AdminUser } from "../../users_schema";

export interface LetterSetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   subject: string;
   body: string;
   from_id: number;
   to_id: number;
}
