import { Skill } from "../../../database/models/skills_schema";
import { Route } from "../../../services";
import ErrorResponseServerAPI from "../../../services/ServerAPI/models/ErrorResponseServerAPI";

export default new Route({
   method: 'GET',
   routePath: '/skill/public/user-skills',
   controller: async (req, res) => {
      const { language_set = 'en' } = req.query;

      try {
         const masterUserSkills = await Skill.getMasterUserPublic(language_set as string);
         res.status(200).send(masterUserSkills);
      } catch (error) {
         new ErrorResponseServerAPI().send(res);
      }
   }
});
