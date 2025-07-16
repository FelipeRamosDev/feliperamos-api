import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import database from '../../../../database';
import CompanySet from '../CompanySet/CompanySet';
import { CompanySetup, CreateCompanyData } from './Company.types';

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
         throw new ErrorDatabase('Company name and location are required to create a new company.', 'COMPANY_CREATION_ERROR');
      }

      const created = await database.insert('companies_schema', 'companies').data({
         company_name,
         location,
         logo_url,
         site_url,
      }).returning().exec();

      if (created.error) {
         throw new ErrorDatabase('Failed to create company', 'COMPANY_CREATION_ERROR');
      }

      const [ createdCompany ] = created.data || [];
      if (!createdCompany) {
         throw new ErrorDatabase('No company created', 'COMPANY_CREATION_ERROR');
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

   static async getById(company_id: number, language_set: string = 'en'): Promise<Company[]> {
      const companyQuery = database.select('companies_schema', 'company_sets');

      companyQuery.where({ company_id, language_set });
      companyQuery.populate('company_id', [ 'company_name', 'location', 'logo_url', 'site_url' ]);

      const { error, data = [] } = await companyQuery.exec();

      if (error) {
         throw new ErrorDatabase('Failed to fetch company', 'COMPANY_QUERY_ERROR');
      }

      const [ companyData ] = data;
      return companyData;
   }

   static async query(user_id: number, language_set: string): Promise<Company[]> {
      const companiesQuery = database.select('companies_schema', 'company_sets');

      companiesQuery.where({ user_id, language_set });
      companiesQuery.populate('company_id', [ 'company_name', 'location', 'logo_url', 'site_url' ]);

      const { error, data = [] } = await companiesQuery.exec();

      if (error) {
         throw new ErrorDatabase('Failed to fetch companies', 'COMPANY_QUERY_ERROR');
      }

      return data.map((companyData) => new Company(companyData));
   }
}
