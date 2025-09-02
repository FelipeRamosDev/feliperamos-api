import Schema from '../../services/Database/models/Schema';
import letters from '../tables/letters_schema/letters';

export default new Schema({
   name: 'letters_schema',
   tables: [ letters ]
});
