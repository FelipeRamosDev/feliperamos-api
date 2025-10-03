import Schema from '../../services/Database/models/Schema';
import comments from '../tables/messages_schema/comments';
import chats from '../tables/messages_schema/chats';

export default new Schema({
   name: 'messages_schema',
   tables: [ comments, chats ]
});
