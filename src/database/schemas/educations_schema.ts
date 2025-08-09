import Schema from '../../services/Database/models/Schema';
import educations from '../../database/tables/educations_schema/educations';
import education_sets from '../../database/tables/educations_schema/education_sets';

export default new Schema({
   name: 'educations_schema',
   tables: [ educations, education_sets ]
});
