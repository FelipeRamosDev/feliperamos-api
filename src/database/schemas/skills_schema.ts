import Schema from '../../services/Database/models/Schema';
import skills from '../tables/skills_schema/skills';

export default new Schema({
   name: 'skills_schema',
   tables: [ skills ]
});
