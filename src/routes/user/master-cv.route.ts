import { CV } from '../../database/models/curriculums_schema';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'GET',
   routePath: '/user/master-cv',
   controller: async (req, res) => {
      const { language_set } = req.query;
      const lang = language_set ? String(language_set) : undefined;

      try {
         const masterCV = await CV.getMaster(lang);
         res.status(200).send(masterCV);
      } catch (error) {
         console.error('Error fetching master CV:', error);
         new ErrorResponseServerAPI('Internal Server Error', 500, 'ERROR_FETCHING_MASTER_CV');
      }
   }
});
