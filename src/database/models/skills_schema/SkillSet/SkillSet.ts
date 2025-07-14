import TableRow from '../../../../services/Database/models/TableRow';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { SkillSetSetup } from './SkillSet.types';

export default class SkillSet extends TableRow {
   public skill_id: number;
   public language_set: string;
   public journey?: string;

   constructor (setup: SkillSetSetup) {
      super('skills_schema', 'skills', setup);

      const { skill_id, language_set = 'en', journey } = setup || {};

      if (!skill_id) {
         throw new ErrorDatabase(`SkillSet requires skill_id`, 'SKILL_SET_SETUP_ERROR');
      }

      this.skill_id = skill_id;
      this.language_set = language_set;
      this.journey = journey;
   }

   static async set(skillSetData: SkillSetSetup): Promise<SkillSet> {
      try {
         const { data = [] } = await database.insert('skills_schema', 'skill_sets').data(skillSetData).returning().exec();
         const [ skillSetCreated ] = data;

         if (!skillSetCreated) {
            throw new ErrorDatabase(`Skill set creation failed!`, 'SKILL_SET_CREATION_FAILED');
         }

         return new SkillSet(skillSetCreated);
      } catch (error) {
         throw error;
      }
   }
}
