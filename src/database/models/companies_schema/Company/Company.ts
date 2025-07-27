import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import database from '../../../../database';
import CompanySet from '../CompanySet/CompanySet';
import { CompanySetup, CreateCompanyData } from './Company.types';
import { CompanySetSetup } from '../CompanySet/CompanySet.types';

export default class Company extends CompanySet {
   public company_name: string;
   public location: string;
   public logo_url: string;
   public site_url: string;
   public languageSets: CompanySetSetup[];

   constructor(setup: CompanySetup, schemaName: string = 'companies_schema', tableName: string = 'companies') {
      super(setup, schemaName, tableName);

      const {
         company_name = '',
         location = '',
         logo_url = '',
         site_url = '',
         languageSets = [],
      } = setup || {};

      this.company_name = company_name;
      this.location = location;
      this.logo_url = logo_url;
      this.site_url = site_url;

      this.languageSets = languageSets.map((companySet: CompanySetSetup) => new CompanySet(companySet));
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

      const [createdCompany] = created.data || [];
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

   static async getById(company_id: number, language_set: string = 'en'): Promise<Company> {
      try {
         const companyQuery = database.select('companies_schema', 'company_sets');
   
         companyQuery.where({ company_id, language_set });
         companyQuery.populate('company_id', [ 'companies.id', 'company_name', 'location', 'logo_url', 'site_url' ]);

         const { error, data = [] } = await companyQuery.exec();
   
         if (error) {
            throw new ErrorDatabase('Failed to fetch company', 'COMPANY_QUERY_ERROR');
         }
   
         const [ companyData ] = data;
         return new Company(companyData);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'COMPANY_QUERY_ERROR');
      }
   }

   static async query(user_id: number, language_set: string): Promise<Company[]> {
      try {
         const companiesQuery = database.select('companies_schema', 'company_sets');
   
         companiesQuery.where({ user_id, language_set });
         companiesQuery.populate('company_id', ['companies.id', 'company_name', 'location', 'logo_url', 'site_url']);
   
         const { error, data = [] } = await companiesQuery.exec();
   
         if (error) {
            throw new ErrorDatabase('Failed to fetch companies', 'COMPANY_QUERY_ERROR');
         }
   
         return data.map((companyData) => new Company(companyData));
      } catch (error) {
         throw new ErrorDatabase('Failed to fetch companies', 'COMPANY_QUERY_ERROR');
      }
   }

   static async getFullSet(company_id: number): Promise<Company | null> {
      try {
         const companyQuery = database.select('companies_schema', 'companies');

         companyQuery.where({ id: company_id });

         const { error, data = [] } = await companyQuery.exec();
         const [companyData] = data;

         if (error) {
            throw new ErrorDatabase('Failed to fetch company', 'COMPANY_QUERY_ERROR');
         }

         if (!companyData) {
            return null;
         }

         const companySetQuery = database.select('companies_schema', 'company_sets');
         companySetQuery.where({ company_id });

         const { data: companySetData = [], error: companyError } = await companySetQuery.exec();

         if (companyError) {
            throw new ErrorDatabase('Failed to fetch company set', 'COMPANY_SET_QUERY_ERROR');
         }

         companyData.languageSets = companySetData;
         return companyData ? new Company(companyData) : null;
      } catch (error) {
         console.error('Error fetching company:', error);
         throw new ErrorDatabase('Failed to fetch company', 'COMPANY_QUERY_ERROR');
      }
   }

   static async update(id: number, updates: Partial<CompanySetup>): Promise<Company | null> {
      if (!id) {
         throw new ErrorDatabase('Company ID is required for update', 'COMPANY_UPDATE_ERROR');
      }

      try {
         const updatedQuery = database.update('companies_schema', 'companies');
   
         updatedQuery.where({ id });
         updatedQuery.set(updates);
         updatedQuery.returning();
   
         const { data = [], error } = await updatedQuery.exec();
         const [ updatedCompany ] = data;
   
         if (error) {
            throw new ErrorDatabase('Failed to update company', 'COMPANY_UPDATE_ERROR');
         }
   
         if (!updatedCompany) {
            return null;
         }
   
         return new Company(updatedCompany);
      } catch (error) {
         console.error('Error updating company:', error);
         throw new ErrorDatabase('Failed to update company', 'COMPANY_UPDATE_ERROR');
      }
   }
}
