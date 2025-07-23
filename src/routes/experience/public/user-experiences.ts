import { Experience } from "../../../database/models/experiences_schema";
import { Route } from "../../../services";
import ErrorResponseServerAPI from "../../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'GET',
   routePath: '/experience/public/user-experiences',
   controller: async (req, res) => {
      const { language_set = 'en' } = req.query;

      try {
         const masterExperiences: Experience[] = await Experience.getMasterUserPublic(language_set as string);
         const sortedExperiences = masterExperiences.sort((a, b) => {
            if (!b.start_date) return 1;
            if (!a.start_date) return -1;
            if (a.start_date === b.start_date) return 0;

            return a.start_date > b.start_date ? -1 : 1;
         });

         res.status(200).send(sortedExperiences);
      } catch (error: any) {
         new ErrorResponseServerAPI(error.message, 500, error.code).send(res);
      }
   }
});
