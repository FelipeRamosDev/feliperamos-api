import ErrorDatabase from '../../../../services/Database/ErrorDatabase';
import { Experience } from '../../experiences_schema';
import { Skill } from '../../skills_schema';
import CVSet from '../CVSet/CVSet';
import { CVSetSetup } from '../CVSet/CVSet.types';
import { CVSetup } from './CV.types';
import database from '../../../../database';
import { AdminUser } from '../../users_schema';
import { AdminUserPublic } from '../../users_schema/AdminUser/AdminUser.types';
import { defaultLocale } from '../../../../app.config';

export default class CV extends CVSet {
   public title: string;
   public experience_time: number | null;
   public is_master: boolean;
   public notes?: string;
   public cv_experiences?: (Experience | number)[];
   public cv_skills?: (Skill | number)[];
   public languageSets: CVSet[];
   public cv_owner_id?: number;

   static populateFields = [
      'cvs.id',
      'title',
      'is_master',
      'experience_time',
      'notes',
      'cv_experiences',
      'cv_skills'
   ]

   constructor(setup: CVSetup & CVSetSetup) {
      super(setup, 'curriculums_schema', 'cvs');

      const {
         title = '',
         experience_time = 0,
         is_master = false,
         notes = '',
         cv_owner_id,
         user_id,
         cv_skills = [],
         cv_experiences = [],
         languageSets = []
      } = setup || {};

      this.title = title;
      this.experience_time = experience_time;
      this.is_master = Boolean(is_master);
      this.notes = notes;
      this.languageSets = languageSets;
      this.cv_owner_id = cv_owner_id || user_id;

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
         cv_owner_id: this.cv_owner_id,
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
         const [expIndex] = this.cv_experiences;

         if (typeof expIndex === 'number') {
            this.cv_experiences = await Experience.getManyById(this.cv_experiences as number[], this.language_set || defaultLocale);
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
         const [skillIndex] = this.cv_skills;
         if (typeof skillIndex === 'number') {
            this.cv_skills = await Skill.getManyById(this.cv_skills as number[], this.language_set || defaultLocale);
         }

         return this.cv_skills as Skill[];
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_SKILLS_FETCH_ERROR');
      }
   }

   async populateUser(): Promise<AdminUserPublic | null> {
      if (!this.cv_owner_id) {
         return null;
      }

      try {
         const user = await AdminUser.getById(this.cv_owner_id);

         if (!user) {
            throw null;
         }
         
         this.user = user.toPublic();
         return this.user;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_USER_FETCH_ERROR');
      }
   }

   async save(props?: CVSetup): Promise<CV> {
      try {
         const { data = [], error } = await database.insert('curriculums_schema', 'cvs').data(this.toSave).returning().exec();
         const [savedCV] = data;

         if (error) {
            throw new ErrorDatabase('Failed to save CV', 'CV_SAVE_ERROR');
         }

         if (!savedCV) {
            throw new ErrorDatabase('No CV saved', 'CV_SAVE_NO_DATA');
         }

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

   static async getMaster(language_set: string = defaultLocale): Promise<CV | null> {
      try {
         const user = await AdminUser.getMaster();

         if (!user?.id) {
            throw new ErrorDatabase('Master user not found', 'CV_MASTER_USER_NOT_FOUND');
         }

         const user_id = user.id;
         const [masterCV] = await this.getUserCVs(user_id, language_set, true);

         if (!masterCV) {
            return null;
         }

         return masterCV;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_MASTER_FETCH_ERROR');
      }
   }

   static async getUserCVs(user_id: number, language_set: string = defaultLocale, onlyMaster?: boolean): Promise<CV[]> {
      try {
         const getQuery = database.select('curriculums_schema', 'cv_sets');

         if (onlyMaster) {
            getQuery.where({ user_id, language_set, is_master: true });
         } else {
            getQuery.where({ user_id, language_set });
         }

         getQuery.populate('cv_id', this.populateFields);
         const { data = [], error } = await getQuery.exec();

         if (error) {
            throw new ErrorDatabase('Failed to fetch user CVs', 'CV_FETCH_ERROR');
         }

         const parsedCV = data.map(cvData => new CV(cvData));
         for (const cvData of parsedCV) {
            await cvData.populateSkills();
            await cvData.populateExperiences();
            await cvData.populateUser();
         }

         return parsedCV;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }

   static async getById(id: number, language_set: string = defaultLocale): Promise<CV | null> {
      if (!id) {
         throw new ErrorDatabase('CV ID is required', 'CV_ID_REQUIRED');
      }

      try {
         const cvQuery = database.select('curriculums_schema', 'cv_sets');
         cvQuery.where({ cv_id: id, language_set });
         cvQuery.populate('cv_id', this.populateFields);
         cvQuery.populate('user_id', [
            'cvs.id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'birth_date',
            'country',
            'state',
            'city',
            'role',
            'avatar_url',
            'portfolio_url',
            'github_url',
            'linkedin_url',
            'whatsapp_number'
         ]);

         const { data: cvData = [], error } = await cvQuery.exec();
         const [cvRaw] = cvData;

         if (error) {
            throw new ErrorDatabase('Failed to fetch CV by ID', 'CV_FETCH_ERROR');
         }

         if (!cvRaw) {
            return null;
         }

         const cv = new CV(cvRaw);

         await cv.populateExperiences();
         await cv.populateSkills();

         return cv;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }

   static async getFullById(id: number): Promise<CV | null> {
      try {
         const cvQuery = database.select('curriculums_schema', 'cvs');
         cvQuery.where({ id });

         const { data = [], error } = await cvQuery.exec();
         const [cvData] = data;

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
         await cv.populateUser();

         return cv;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_FETCH_ERROR');
      }
   }

   static async update(cv_id: number, updates: Partial<CVSetup>): Promise<CV | null> {
      try {
         const updateQuery = database.update('curriculums_schema', 'cvs');

         updateQuery.where({ id: cv_id });
         updateQuery.set(updates);
         updateQuery.returning();

         const { data = [], error } = await updateQuery.exec();
         const [updatedCV] = data;

         if (error) {
            throw new ErrorDatabase('Failed to update CV', 'CV_UPDATE_ERROR');
         }

         return new CV(updatedCV);
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_UPDATE_ERROR');
      }
   }

   static async setUserMasterCV(cv_id: number, userId: number): Promise<CV | null> {
      try {
         const disableAllQuery = database.update('curriculums_schema', 'cvs');
         disableAllQuery.set({ is_master: false });
         disableAllQuery.where({ cv_owner_id: userId, is_master: true });

         const { error } = await disableAllQuery.exec();
         if (error) {
            throw new ErrorDatabase('Failed to disable all master CVs', 'CV_DISABLE_ALL_ERROR');
         }

         const enableMaster = await this.update(cv_id, { is_master: true });
         if (!enableMaster) {
            throw new ErrorDatabase('Failed to enable master CV', 'CV_ENABLE_MASTER_ERROR');
         }

         return enableMaster;
      } catch (error: any) {
         throw new ErrorDatabase(error.message, error.code || 'CV_SET_MASTER_ERROR');
      }
   }

   static async delete(cv_id: number): Promise<CV[]> {
      if (!cv_id) {
         throw new ErrorDatabase('CV ID is required for deletion', 'CV_DELETE_ERROR');
      }

      try {
         const deleteSetQuery = database.delete('curriculums_schema', 'cv_sets').where({ cv_id });
         const { error: setError } = await deleteSetQuery.exec();

         if (setError) {
            throw new ErrorDatabase('Failed to delete CV set', 'CV_SET_DELETE_ERROR');
         }

         const deleteQuery = database.delete('curriculums_schema', 'cvs').where({ id: cv_id }).returning();
         const { data: deletedCVs = [], error: cvError } = await deleteQuery.exec();
         if (cvError) {
            throw new ErrorDatabase('Failed to delete CV', 'CV_DELETE_ERROR');
         }

         return deletedCVs.map(cv => new CV(cv));
      } catch (error: any) {
         console.error('Error deleting CV:', error);
         throw new ErrorDatabase(error.message, error.code || 'CV_DELETE_ERROR');
      }
   }
}
