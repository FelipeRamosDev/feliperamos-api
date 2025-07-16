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

   static async getSkillsByUserId(userId: number, language_set: string = 'en'): Promise<Skill[]> {
      try {
         const query = database.select('skills_schema', 'skill_sets');
         query.where({ user_id: userId, language_set });
         query.populate('skill_id', ['name', 'category', 'level']);

         const { data = [], error } = await query.exec();
         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         return data.map(skill => new Skill(skill));
      } catch (error) {
         throw error;
      }
   }

   static async getById(skill_id: number, language_set: string = 'en'): Promise<Skill | null> {
      try {
         const query = database.select('skills_schema', 'skill_sets');

         query.where({ skill_id, language_set });
         query.populate('skill_id', ['name', 'category', 'level']);

         const { data = [], error } = await query.exec();
         const [ dataSkill ] = data;
         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         if (!dataSkill) {
            return null;
         }

         return new Skill(dataSkill);
      } catch (error) {
         throw error;
      }
   }

   static async getManyByIds(skillIds: number[], language_set: string = 'en'): Promise<Skill[]> {
      try {
         const query = database.select('skills_schema', 'skill_sets');
         const skillIdsSet = skillIds.map(id => ({ skill_id: id, language_set }));

         query.where(skillIdsSet);
         query.populate('skill_id', ['name', 'category', 'level']);

         const { data = [], error } = await query.exec();
         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         return data.map(skill => new Skill(skill));
      } catch (error) {
         throw error;
      }
   }
}
