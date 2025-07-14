import database from '../../../../database';
import TableRow from '../../../../services/Database/models/TableRow';
import { ExperienceSetSetup } from './ExperienceSet.types';

export default class ExperienceSet extends TableRow {
   public slug: string;
   public position: string;
   public language_set: string;
   public summary: string;
   public description: string;
   public responsibilities: string;
   public user_id: number;

   constructor (setup: ExperienceSetSetup, schemaName: string = 'experiences_schema', tableName: string = 'experience_sets') {
      super(schemaName, tableName, setup);

      if (!setup) {
         throw new Error('Setup is required to create an ExperienceSet instance.');
      }

      const {
         slug = '',
         position = '',
         language_set = '',
         summary = '',
         description = '',
         responsibilities = '',
         user_id
      } = setup || {};

      this.slug = slug;
      this.position = position;
      this.language_set = language_set;
      this.summary = summary;
      this.description = description;
      this.responsibilities = responsibilities;
      this.user_id = user_id;
   }

   static async set(data: Partial<ExperienceSetSetup>): Promise<ExperienceSet> {
      try {
         const savedQuery = await database.insert('experiences_schema', 'experience_sets').data({
            slug: data.slug,
            position: data.position,
            summary: data.summary,
            description: data.description,
            responsibilities: data.responsibilities,
            experience_id: data.experience_id,
            user_id: data.user_id
         }).returning().exec();

         if (savedQuery.error) {
            throw new Error('Failed to create ExperienceSet');
         }

         if (!savedQuery.data || !Array.isArray(savedQuery.data)) {
            throw new Error('Invalid data returned when creating ExperienceSet');
         }

         const [ createdExperienceSet ] = savedQuery.data;
         if (!createdExperienceSet) {
            throw new Error('No ExperienceSet created');
         }

         return new ExperienceSet(createdExperienceSet);
      } catch (error) {
         console.error('Error creating ExperienceSet:', error);
         throw new Error('Failed to create ExperienceSet');
      }
   }
}
