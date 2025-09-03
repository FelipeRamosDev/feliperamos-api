import Schema from '../../services/Database/models/Schema';
import comments from '../tables/comments_schemas/comments';

export default new Schema({
   name: 'comments_schemas',
   tables: [ comments ]
});
