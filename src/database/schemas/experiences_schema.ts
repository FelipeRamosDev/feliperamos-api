import Schema from '../../services/Database/models/Schema';
import experience_sets from '../tables/experiences_schema/experience_sets';
import experiences from '../tables/experiences_schema/experiences';

export default new Schema({
   name: 'experiences_schema',
   tables: [ experiences, experience_sets ]
});
