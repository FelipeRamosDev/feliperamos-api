import Schema from '../../services/Database/models/Schema';
import cvs from '../tables/curriculums_schema/cvs';
import cvSets from '../tables/curriculums_schema/cv_sets';

export default new Schema({
   name: 'curriculums_schema',
   tables: [ cvs, cvSets ]
});
