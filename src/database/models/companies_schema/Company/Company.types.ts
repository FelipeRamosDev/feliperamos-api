import { CompanySetSetup } from "../CompanySet/CompanySet.types";

export interface CompanySetup extends CompanySetSetup {
   name: string;
   location: string;
   logo_url: string;
   site_url: string;
}

export interface CreateCompanyData {
   name: string;
   location: string;
   logo_url?: string;
   site_url?: string;
   description?: string;
   field_activity?: string;
}
