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
   public cv_experiences?: (Experience | number)[];
   public cv_skills?: (Skill | number)[];
   public languageSets: CVSet[];

   constructor(setup: CVSetup & CVSetSetup) {
      super(setup, 'curriculums_schema', 'cvs');

      const {
         title = '',
         is_master = false,
         notes = '',
         cv_skills = [],
         cv_experiences = [],
         languageSets = []
      } = setup || {};

      this.title = title;
      this.is_master = Boolean(is_master);
      this.notes = notes;
      this.languageSets = languageSets;

      this.cv_experiences = cv_experiences.map(exp => {
         if (typeof exp === 'number') {
            return exp;
         } else if (exp instanceof Experience) {
            return exp;
         } else {
            return new Experience(exp);
         }
      });

      this.cv_skills = cv_skills.map(skill => {
         if (typeof skill === 'number') {
            return skill;
         } else if (skill instanceof Skill) {
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

   async populateSets(): Promise<CVSet[]> {
      try {
         const cvQuery = database.select('curriculums_schema', 'cv_sets');
         cvQuery.where({ cv_id: this.id });

         const { data = [], error } = await cvQuery.exec();

         if (error) {
            throw new ErrorDatabase('Failed to fetch CV by ID', 'CV_FETCH_ERROR');
         }

         const parsed = data.map(cvData => new CVSet(cvData));

         this.languageSets = parsed;
         return parsed;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }

   async populateExperiences(): Promise<Experience[]> {
      if (!this.cv_experiences || this.cv_experiences.length === 0) {
         this.cv_experiences = [];
         return this.cv_experiences as [];
      }

      try {
         const [ expIndex ] = this.cv_experiences;

         if (typeof expIndex === 'number') {
            this.cv_experiences = await Experience.getManyById(this.cv_experiences as number[], this.language_set || 'en');
         }

         return this.cv_experiences as Experience[];
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_EXPERIENCES_FETCH_ERROR');
      }
   }

   async populateSkills(): Promise<Skill[]> {
      if (!this.cv_skills || this.cv_skills.length === 0) {
         this.cv_skills = [];
         return this.cv_skills as [];
      }

      try {
         const [ skillIndex ] = this.cv_skills;

         if (typeof skillIndex === 'number') {
            this.cv_skills = await Skill.getManyById(this.cv_skills as number[], this.language_set || 'en');
         }

         return this.cv_skills as Skill[];
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_SKILLS_FETCH_ERROR');
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

   static async getUserCVs(user_id: number, language_set: string = 'en'): Promise<CV[]> {
      try {
         const getQuery = database.select('curriculums_schema', 'cv_sets');

         getQuery.where({ user_id, language_set });
         getQuery.populate('cv_id', [ 'title', 'is_master', 'notes', 'cv_experiences', 'cv_skills' ]);

         const { data = [], error } = await getQuery.exec();

         if (error) {
            throw new ErrorDatabase('Failed to fetch user CVs', 'CV_FETCH_ERROR');
         }

         for (const cvData of data) {
            cvData.cv_skills = await Skill.getManyById(cvData.cv_skills, language_set);
            cvData.cv_experiences = await Experience.getManyById(cvData.cv_experiences, language_set);
         }

         return data.map(cvData => new CV(cvData));
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }

   static async getFullById(id: number): Promise<CV | null> {
      try {
         const cvQuery = database.select('curriculums_schema', 'cvs');
         cvQuery.where({ id });

         const { data = [], error } = await cvQuery.exec();
         const [ cvData ] = data;

         if (error) {
            throw new ErrorDatabase('Failed to fetch CV by ID', 'CV_FETCH_ERROR');
         }

         if (!cvData) {
            return null;
         }

         const cv = new CV(cvData);

         await cv.populateSets();
         await cv.populateExperiences();
         await cv.populateSkills();

         return cv;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }
}
