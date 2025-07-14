import ExperienceSet from '../ExperienceSet/ExperienceSet';
import { ExperienceCreateSetup, ExperienceSetup, ExperienceStatus, ExperienceType } from './Experience.types';
import database from '../../../../database';
import ErrorDatabase from '../../../../services/Database/ErrorDatabase';

export default class Experience extends ExperienceSet {
   public type: ExperienceType;
   public status: ExperienceStatus;
   public title: string;
   public start_date: Date | null;
   public end_date: Date | null;
   public company_id: number;
   public skills: number[];

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
         end_date = null,
         company_id,
         skills = []
      } = setup;

      this.type = type;
      this.status = status;
      this.title = title;
      this.start_date = start_date ? new Date(start_date) : null;
      this.end_date = end_date ? new Date(end_date) : null;
      this.company_id = company_id;
      this.skills = skills;
   }

   static async create(data: ExperienceCreateSetup): Promise<Experience> {
      try {
         const savedQuery = await database.insert('experiences_schema', 'experiences').data({
            type: data.type,
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            skills: data.skills
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

   static async getByUserId(userId: number, language_set: string): Promise<Experience[]> {
      try {
         const query = database.select('experiences_schema', 'experience_sets');

         query.where({ user_id: userId, language_set });
         query.populate('experience_id', [ 'title', 'type', 'status', 'start_date', 'end_date', 'company_id', 'skills' ]);

         const { data, error } = await query.exec();

         if (error) {
            throw new ErrorDatabase('Failed to fetch Experiences: ' + error.message, 'EXPERIENCE_QUERY_ERROR');
         }
         
         if (!data || !Array.isArray(data)) {
            return [];
         }

         return data.map(exp => new Experience(exp));
      } catch (error) {
         throw error;
      }
   }
}
