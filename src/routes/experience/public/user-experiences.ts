import { Experience } from "../../../database/models/experiences_schema";
import { Route } from "../../../services";
import ErrorResponseServerAPI from "../../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'GET',
   routePath: '/experience/public/user-experiences',
   controller: async (req, res) => {
      const { language_set = 'en' } = req.query;

      try {
         const masterExperiences = await Experience.getMasterUserPublic(language_set as string);
         res.status(200).send(masterExperiences);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code).send(res);
      }
   }
});
