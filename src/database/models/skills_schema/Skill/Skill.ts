import { SkillCreateSetup, SkillSetup } from './Skill.types';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import SkillSet from '../SkillSet/SkillSet';

export default class Skill extends SkillSet {
   public name: string;
   public category: string;
   public level: number;
   public languageSets?: any[];

   constructor (setup: SkillSetup) {
      super(setup);

      const { name, level, category, languageSets } = setup || {};

      this.name = name;
      this.level = level;
      this.category = category;
      this.languageSets = languageSets;
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

   static async getMasterUserPublic(language_set: string) {
      try {
         const { data: userData = [], error: userError } = await database.select('users_schema', 'admin_users').where({ role: 'master' }).exec();
         const [ masterUser ] = userData;

         if (userError) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         const skillsData = await this.getSkillsByUserId(masterUser.id, language_set);

         if (!skillsData) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         return skillsData;
      } catch (error) {
         throw new ErrorDatabase('', '');
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

         return data.map(skill => new Skill(skill)).sort((a, b) => b.level - a.level);
      } catch (error) {
         throw error;
      }
   }

   static async getById(skill_id: number, language_set: string = 'en'): Promise<Skill | null> {
      try {
         const query = database.select('skills_schema', 'skill_sets');

         query.where({ skill_id, language_set });
         query.populate('skill_id', ['skills.id', 'name', 'category', 'level']);

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

   static async getManyById(skillIds: number[], language_set?: string): Promise<Skill[]> {
      if (!Array.isArray(skillIds)) {
         return [];
      }

      try {
         const query = database.select('skills_schema', 'skill_sets');
         const skillIdsSet = skillIds.map(id => ({ skill_id: id, language_set }));

         query.where(skillIdsSet);
         query.populate('skill_id', ['skills.id', 'name', 'category', 'level']);

         const { data = [], error } = await query.exec();
         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         return data.map(skill => new Skill(skill)).filter(skill => skill.language_set === language_set).sort((a, b) => b.level - a.level);
      } catch (error) {
         throw error;
      }
   }

   static async getFullSet(id: number): Promise<Skill | null> {
      try {
         const query = database.select('skills_schema', 'skills').where({ id });

         const { data = [], error } = await query.exec();
         const [ dataSkill ] = data;

         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         if (!dataSkill) {
            return null;
         }

         const { data: skillSetsData } = await database.select('skills_schema', 'skill_sets').where({ skill_id: id }).exec();
         if (!skillSetsData || !skillSetsData.length) {
            return null;
         }

         dataSkill.languageSets = skillSetsData;
         return new Skill(dataSkill);
      } catch (error) {
         throw error;
      }
   }

   static async update(id: number, updates: Partial<SkillSetup>): Promise<Skill | null> {
      try {
         const { data = [], error } = await database.update('skills_schema', 'skills').set(updates).where({ id }).returning().exec();
         const [ updatedSkill ] = data;

         if (error) {
            throw new ErrorDatabase(`Database error caught!`, 'DATABASE_ERROR');
         }

         if (!updatedSkill) {
            return null;
         }

         return new Skill(updatedSkill);
      } catch (error) {
         throw error;
      }
   }
}
