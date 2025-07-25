import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { Experience } from '../../experiences_schema';
import { Skill } from '../../skills_schema';
import CVSet from '../CVSet/CVSet';
import { CVSetSetup } from '../CVSet/CVSet.types';
import { CVSetup } from './CV.types';
import database from '../../../../database';

export default class CV extends CVSet {
   public title: string;
   public is_master: boolean;
   public notes?: string;
   public cv_experiences?: Experience[];
   public cv_skills?: Skill[];

   constructor(setup: CVSetup & CVSetSetup) {
      super(setup, 'curriculums_schema', 'cvs');

      const {
         title = '',
         is_master = false,
         notes = '',
         cv_skills = [],
         cv_experiences = []
      } = setup || {};

      this.title = title;
      this.is_master = Boolean(is_master);
      this.notes = notes;

      this.cv_experiences = cv_experiences.map(exp => {
         if (typeof exp === 'number') {
            return exp;
         } else {
            return new Experience(exp);
         }
      });

      this.cv_skills = cv_skills.map(skill => {
         if (typeof skill === 'number') {
            return skill;
         } else {
            return new Skill(skill);
         }
      });
   }

   get toSave() {
      return {
         title: this.title,
         notes: this.notes,
         is_master: this.is_master,
         user_id: this.user_id,
         cv_experiences: this.cv_experiences,
         cv_skills: this.cv_skills,
      }
   }

   async save(props?: CVSetup): Promise<CVSet> {
      let processing;

      try {
         const { data = [], error } = await database.insert('curriculums_schema', 'cvs').data(this.toSave).returning().exec();
         const [ savedCV ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to save CV', 'CV_SAVE_ERROR');
         }

         if (!savedCV) {
            throw new ErrorDatabase('No CV saved', 'CV_SAVE_NO_DATA');
         }

         processing = savedCV;
         const cvData = { ...this, ...props, cv_id: savedCV.id };
         const newCVSet = await CVSet.createSet(cvData as CVSetSetup);

         if (!newCVSet) {
            throw new ErrorDatabase('Failed to create CV Set', 'CV_SET_CREATE_ERROR');
         }

         return new CV({ ...newCVSet, ...savedCV });
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_SAVE_ERROR');
      }
   }
}
