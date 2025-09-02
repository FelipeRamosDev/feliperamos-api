import Schema from '../../services/Database/models/Schema';
import opportunities from '../tables/opportunities_schema/opportunities';

export default new Schema({
   name: 'opportunities_schema',
   tables: [ opportunities ]
});
