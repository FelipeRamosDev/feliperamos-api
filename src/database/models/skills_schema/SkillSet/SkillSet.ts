import TableRow from '../../../../services/Database/models/TableRow';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { SkillSetSetup } from './SkillSet.types';

export default class SkillSet extends TableRow {
   public skill_id: number;
   public language_set: string;
   public journey?: string;
   public user_id?: number;

   constructor (setup: SkillSetSetup) {
      super('skills_schema', 'skill_sets', setup);

      const { user_id, skill_id, language_set = 'en', journey } = setup || {};

      this.skill_id = skill_id;
      this.language_set = language_set;
      this.journey = journey;
      this.user_id = user_id;
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

   static async updateSet(id: number, updates: Partial<SkillSetSetup>): Promise<SkillSet | null> {
      try {
         const query = database.update('skills_schema', 'skill_sets');

         query.set(updates);
         query.where({ id });
         query.returning();

         const { data = [] } = await query.exec();
         const [ updatedSkillSet ] = data;

         if (!updatedSkillSet) {
            return null;
         }

         return new SkillSet(updatedSkillSet);
      } catch (error) {
         throw new ErrorDatabase(`Skill set update failed!`, 'SKILL_SET_UPDATE_FAILED');
      }
   }
}
