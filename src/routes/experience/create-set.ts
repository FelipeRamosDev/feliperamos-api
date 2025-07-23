import database from '../../database';
import { Route } from '../../services';
import ErrorResponseServerAPI from '../../services/ServerAPI/models/ErrorResponseServerAPI';

export default new Route({
   method: 'POST',
   routePath: '/experience/create-set',
   useAuth: true,
   allowedRoles: [ 'master', 'admin' ],
   controller: async (req, res) => {
      const userId = req.session.user?.id;
      const dataSet = Object(req.body);

      try {
         const { data = [], error } = await database.insert('experiences_schema', 'experience_sets').data({ ...dataSet, user_id: userId }).returning().exec();
         const [ created ] = data;

         if (!created || error) {
            new ErrorResponseServerAPI('Failed to create experience set', 400, 'CREATE_EXPERIENCE_SET').send(res);
         }

         res.status(201).send(created);
      } catch (error) {
         console.error('Error creating experience set:', error);
         new ErrorResponseServerAPI('Failed to create experience set', 500, 'CREATE_EXPERIENCE_SET').send(res);
      }
   }
});