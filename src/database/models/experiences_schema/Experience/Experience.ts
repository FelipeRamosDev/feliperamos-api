import ExperienceSet from '../ExperienceSet/ExperienceSet';
import { ExperienceCreateSetup, ExperienceSetup, ExperienceStatus, ExperienceType } from './Experience.types';
import database from '../../../../database';

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
         throw new Error('Setup is required to create an Experience instance.');
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
            throw new Error('Failed to create Experience');
         }
         
         if (!savedQuery.data || !Array.isArray(savedQuery.data)) {
            throw new Error('Invalid data returned when creating Experience');
         }

         const [ createdExperience ] = savedQuery.data;
         if (!createdExperience) {
            throw new Error('No Experience created');
         }

         const createdDefaultSet = await ExperienceSet.set({
            ...data,
            experience_id: createdExperience.id,
         });

         return new Experience({ ...createdExperience, ...createdDefaultSet });
      } catch (error: any) {
         throw new Error('Failed to create Experience: ' + error.message);
      }
   }
}
