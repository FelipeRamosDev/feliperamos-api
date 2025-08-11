import Schema from '../../services/Database/models/Schema';
import languages from '../tables/languages_schema/languages';

export default new Schema({
   name: 'languages_schema',
   tables: [ languages ]
});
