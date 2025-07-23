import Schema from '../../services/Database/models/Schema';
import companies from '../tables/companies_schema/companies';
import company_sets from '../tables/companies_schema/company_sets';

export default new Schema({
   name: 'companies_schema',
   tables: [ companies, company_sets ]
});
