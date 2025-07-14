import Schema from '../../services/Database/models/Schema';
import skill_sets from '../tables/skills_schema/skill_sets';
import skills from '../tables/skills_schema/skills';

export default new Schema({
   name: 'skills_schema',
   tables: [ skills, skill_sets ]
});
