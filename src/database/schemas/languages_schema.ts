import Schema from '../../services/Database/models/Schema';
import languages from '../tables/languages_schema/languages';
import language_sets from '../tables/languages_schema/language_sets';

export default new Schema({
   name: 'languages_schema',
   tables: [ languages, language_sets ]
});
