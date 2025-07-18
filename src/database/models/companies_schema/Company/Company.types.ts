import { CompanySetSetup } from "../CompanySet/CompanySet.types";

export interface CompanySetup extends CompanySetSetup {
   company_name: string;
   location: string;
   logo_url: string;
   site_url: string;
   languageSets: CompanySetSetup[];
}

export interface CreateCompanyData {
   company_name: string;
   location: string;
   logo_url?: string;
   site_url?: string;
   description?: string;
   industry?: string;
   user_id?: number;
}

export interface QueryCompanyParams {
   user_id: number;
   language_set?: string[];
}
