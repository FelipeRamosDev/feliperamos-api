import database from "../../../../database";
import CompanySet from "../CompanySet/CompanySet";
import { CompanySetup, CreateCompanyData } from "./Company.types";

export default class Company extends CompanySet {
   public company_name: string;
   public location: string;
   public logo_url: string;
   public site_url: string;

   constructor(setup: CompanySetup, schemaName: string = 'companies_schema', tableName: string = 'companies') {
      super(setup, schemaName, tableName);

      const {
         company_name = '',
         location = '',
         logo_url = '',
         site_url = '',
      } = setup || {};

      this.company_name = company_name;
      this.location = location;
      this.logo_url = logo_url;
      this.site_url = site_url;
   }

   static async create(data: CreateCompanyData): Promise<Company> {
      const { company_name, location, logo_url, site_url, ...companySetData } = Object(data);

      if (!company_name || !location) {
         throw new Error('Company name and location are required to create a new company.');
      }

      const created = await database.insert('companies_schema', 'companies').data({
         company_name,
         location,
         logo_url,
         site_url,
      }).returning().exec();

      if (created.error) {
         throw new Error('Failed to create company');
      }

      const [ createdCompany ] = created.data || [];
      if (!createdCompany) {
         throw new Error('No company created');
      }

      const isSet = await CompanySet.set({
         company_id: createdCompany.id,
         ...companySetData,
      });

      return new Company({
         ...createdCompany,
         ...isSet,
      });
   }
}
