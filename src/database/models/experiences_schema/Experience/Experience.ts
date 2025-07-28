import ExperienceSet from '../ExperienceSet/ExperienceSet';
import { ExperienceCreateSetup, ExperienceSetup, ExperienceStatus, ExperienceType } from './Experience.types';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { AdminUser } from '../../users_schema';
import { Company } from '../../companies_schema';
import { Skill } from '../../skills_schema';
import { ExperienceSetSetup } from '../ExperienceSet/ExperienceSet.types';
import { SkillSetup } from '../../skills_schema/Skill/Skill.types';

export default class Experience extends ExperienceSet {
   public type: ExperienceType;
   public status: ExperienceStatus;
   public title: string;
   public start_date: Date | null;
   public end_date: Date | null;
   public company_id: number;
   public company?: Company;
   public skills: Skill[];
   public user?: AdminUser;
   public languageSets: ExperienceSet[];

   constructor(setup: ExperienceSetup) {
      super(setup, 'experiences_schema', 'experiences');

      if (!setup) {
         throw new ErrorDatabase('Setup is required to create an Experience instance.', 'EXPERIENCE_CREATION_ERROR');
      }

      const {
         type,
         status = 'draft',
         title,
         start_date,
         end_date,
         company_id,
         company,
         skills = [],
         languageSets = [],
         user_id
      } = setup;

      this.type = type;
      this.status = status;
      this.title = title;
      this.start_date = new Date(start_date);
      this.end_date = end_date ? new Date(end_date) : new Date();
      this.company_id = company_id;
      this.company = company ? new Company(company) : undefined;
      this.skills = skills?.map((skill: SkillSetup) => new Skill(skill)) || [];
      this.languageSets = languageSets.map((xpSet: ExperienceSetSetup) => new ExperienceSet(xpSet));

      if (user_id) {
         this.user = new AdminUser({ ...setup, id: user_id, created_at: undefined });
      }
   }

   async populateCompany(language_set: string) {
      if (!this.company_id) {
         return;
      }

      try {
         const company = await Company.getById(this.company_id, language_set);

         if (company) {
            this.company = company;
         } else {
            throw new ErrorDatabase('Company not found for the given ID', 'COMPANY_NOT_FOUND');
         }
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'COMPANY_QUERY_ERROR');
      }
   }

   static async create(data: ExperienceCreateSetup): Promise<Experience> {
      try {
         const savedQuery = await database.insert('experiences_schema', 'experiences').data({
            type: data.type,
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            skills: data.skills,
            company_id: data.company_id
         }).returning().exec();

         if (savedQuery.error) {
            throw new ErrorDatabase('Failed to create Experience', 'EXPERIENCE_CREATION_ERROR');
         }
         
         if (!savedQuery.data || !Array.isArray(savedQuery.data)) {
            throw new ErrorDatabase('Invalid data returned when creating Experience', 'EXPERIENCE_CREATION_ERROR');
         }

         const [ createdExperience ] = savedQuery.data;
         if (!createdExperience) {
            throw new ErrorDatabase('No Experience created', 'EXPERIENCE_CREATION_ERROR');
         }

         const createdDefaultSet = await ExperienceSet.set({
            ...data,
            experience_id: createdExperience.id,
         });

         return new Experience({ ...createdExperience, ...createdDefaultSet });
      } catch (error: any) {
         throw new ErrorDatabase('Failed to create Experience: ' + error.message, 'EXPERIENCE_CREATION_ERROR');
      }
   }

   static async getMasterUserPublic(language_set: string) {
      try {
         const { data: userData = [], error: userError } = await database.select('users_schema', 'admin_users').where({ role: 'master' }).exec();
         const [ masterUser ] = userData;

         if (userError) {
            throw new ErrorDatabase('Failed to fetch master user: ' + userError.message, 'USER_FETCH_ERROR');
         }

         if (!masterUser) {
            throw new ErrorDatabase('No master user found', 'USER_NOT_FOUND');
         }

         // Fetch experiences for the master user
         const experiences = await Experience.getByUserId(masterUser.id, language_set, { status: 'published' });
         return experiences;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code);
      }
   }

   static async getFullSet(experienceId: number, language_set?: string): Promise<Experience | null> {
      try {
         const expBaseQuery = database.select('experiences_schema', 'experiences');
         expBaseQuery.where({ 'experiences.id': experienceId });
         expBaseQuery.populate('company_id', [ 'company_name', 'logo_url', 'site_url', 'location' ]);

         const { data = [], error } = await expBaseQuery.exec();
         const [ experienceData ] = data;

         if (error) {
            throw new ErrorDatabase(error.message, error.code);
         }

         if (!experienceData) {
            return null;
         }

         const experienceSetQuery = database.select('experiences_schema', 'experience_sets');
         experienceSetQuery.where({ experience_id: experienceId });

         const { data: experienceSetData = [] } = await experienceSetQuery.exec();
         const company = new Company(experienceData);

         experienceData.company = company;
         experienceData.languageSets = experienceSetData;
         experienceData.skills = await Skill.getManyById(experienceData.skills, language_set);

         return new Experience(experienceData);
      } catch (error: any) {
         throw new ErrorDatabase('Failed to fetch Experience: ' + error.message, 'EXPERIENCE_QUERY_ERROR');
      }
   }

   static async getByUserId(userId: number, language_set: string, options?: { status: string }): Promise<Experience[]> {
      try {
         const query = database.select('experiences_schema', 'experience_sets');

         query.where({ user_id: userId, language_set });
         query.populate('experience_id', [ 'experiences.id', 'title', 'type', 'status', 'start_date', 'end_date', 'company_id', 'skills' ]);
         query.populate('user_id', [ 'experiences.id', 'first_name', 'last_name', 'email', 'role' ]);

         const { data, error } = await query.exec();
         if (error) {
            throw new ErrorDatabase('Failed to fetch Experiences: ' + error.message, 'EXPERIENCE_QUERY_ERROR');
         }
         
         if (!data || !Array.isArray(data)) {
            return [];
         }

         // Populating company data for each experience
         for (const exp of data) {
            if (exp.company_id) {
               exp.company = await Company.getById(exp.company_id, language_set);
            }

            // Populate skills data
            if (Array.isArray(exp.skills) && exp.skills.length) {
               if (exp.skills) {
                  exp.skills = await Skill.getManyById(exp.skills, language_set);
               }
            }
         }

         if (options?.status) {
            const filtered = data.filter(exp => exp.status === options.status);
            return filtered.map(exp => new Experience(exp));
         }

         return data.map(exp => new Experience(exp));
      } catch (error) {
         throw error;
      }
   }

   static async getManyById(ids: number[], language_set: string = 'en'): Promise<Experience[]> {
      try {
         const query = database.select('experiences_schema', 'experience_sets');
         query.where(ids.map(id => ({ experience_id: id, language_set })));
         query.populate('experience_id', [ 'experiences.id', 'title', 'type', 'status', 'start_date', 'end_date', 'company_id', 'skills' ]);

         const { data = [], error } = await query.exec();
         if (error) {
            throw new ErrorDatabase('Failed to fetch Experiences by ID: ' + error.message, 'EXPERIENCE_QUERY_ERROR');
         }

         const parsed = data.map(exp => new Experience(exp));
         for (const experience of parsed) {
            await experience.populateCompany(language_set);
         }

         return parsed;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code);
      }
   }
   static async update(id: number, updates: Partial<Experience>): Promise<Experience> {
      try {
         const updateQuery = database.update('experiences_schema', 'experiences');

         updateQuery.set(updates);
         updateQuery.where({ id });
         updateQuery.returning();

         const { data = [], error } = await updateQuery.exec();
         const [ updatedExperience ] = data;

         if (error || !updatedExperience || !data.length) {
            throw new ErrorDatabase('Experience not found or update failed.', 'EXPERIENCE_UPDATE_ERROR');
         }

         return new Experience(updatedExperience);
      } catch (error: any) {
         if (error instanceof ErrorDatabase) {
            throw error;
         }

         throw new ErrorDatabase('Failed to update experience.', 'EXPERIENCE_UPDATE_ERROR');
      }
   }

   static async delete(experience_id: number): Promise<boolean> {
      if (!experience_id) {
         throw new ErrorDatabase('Experience ID is required for deletion', 'EXPERIENCE_DELETE_ERROR');
      }

      try {
         const deleteSetQuery = database.delete('experiences_schema', 'experience_sets').where({ experience_id });
         const { error: setError } = await deleteSetQuery.exec();

         if (setError) {
            throw new ErrorDatabase('Failed to delete experience set', 'EXPERIENCE_SET_DELETE_ERROR');
         }

         const deleteQuery = database.delete('experiences_schema', 'experiences').where({ id: experience_id });
         const { error: experienceError } = await deleteQuery.exec();
         if (experienceError) {
            throw new ErrorDatabase('Failed to delete experience', 'EXPERIENCE_DELETE_ERROR');
         }
   
         return true;
      } catch (error: any) {
         console.error('Error deleting experience:', error);
         throw new ErrorDatabase(error.message, error.code || 'EXPERIENCE_DELETE_ERROR');
      }
   }
}
