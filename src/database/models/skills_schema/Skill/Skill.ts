import { SkillCreateSetup, SkillSetup } from './Skill.types';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import SkillSet from '../SkillSet/SkillSet';

export default class Skill extends SkillSet {
   public name: string;
   public category: string;
   public level: number;

   constructor (setup: SkillSetup) {
      super(setup);

      const { name, level, category } = setup || {};

      this.name = name;
      this.level = level;
      this.category = category;
   }

   static async create(skillData: SkillCreateSetup): Promise<Skill> {
      try {
         const { data = [], error } = await database.insert('skills_schema', 'skills').data({
            name: skillData.name,
            category: skillData.category,
            level: skillData.level,
         }).returning().exec();
         const [ createdSkill ] = data;

         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         if (!createdSkill) {
            throw new ErrorDatabase(`Skill creation failed!`, 'SKILL_CREATION_FAILED');
         }

         const skillSetCreated = await this.set({
            skill_id: createdSkill.id,
            journey: skillData.journey,
            user_id: skillData.user_id
         });

         return new Skill({ ...createdSkill, ...skillSetCreated });
      } catch (error) {
         throw error;
      }
   }
}
