import 'dotenv/config';

import '../database';
import ServerAPI from '../services/ServerAPI/ServerAPI';

import healthRoute from '../routes/health.route';

import loginRoute from '../routes/auth/login.route';
import authUserRoute from '../routes/auth/user.route';

import experienceCreate from '../routes/experience/create.route';
import experienceCreateSet from '../routes/experience/create-set.route';
import experienceQuery from '../routes/experience/query.route';
import experienceUpdate from '../routes/experience/update.route';
import experienceUpdateSet from '../routes/experience/update-set.route';
import experienceGet from '../routes/experience/experience_id.route';
import experienceDelete from '../routes/experience/delete.route';
import experienceGetPublic from '../routes/experience/public/user-experiences.route';

import skillCreate from '../routes/skill/create.route';
import skillCreateSet from '../routes/skill/create-set.route';
import skillQuery from '../routes/skill/query.route';
import skillGet from '../routes/skill/skill_id.route';
import skillUpdate from '../routes/skill/update.route';
import skillUpdateSet from '../routes/skill/update-set.route';
import skillDelete from '../routes/skill/delete.route';
import skillGetPublic from '../routes/skill/public/user-skills.route';

import companyCreate from '../routes/company/create.route';
import companyCreateSet from '../routes/company/create-set.route';
import companyQuery from '../routes/company/query.route';
import companyUpdate from '../routes/company/update.route';
import companyUpdateSet from '../routes/company/update-set.route';
import companyGet from '../routes/company/company_id.route';
import companyDelete from '../routes/company/delete.route';

import languageCreate from '../routes/language/create.route';
import languageGet from '../routes/language/language_id.route';
import languageUpdate from '../routes/language/update.route';
import languageDelete from '../routes/language/delete.route';

import curriculumCreate from '../routes/curriculum/create.route';
import curriculumCreateSet from '../routes/curriculum/create-set.route';
import curriculumGet from '../routes/curriculum/cv_id.route';
import curriculumUpdate from '../routes/curriculum/update.route';
import curriculumUpdateSet from '../routes/curriculum/update-set.route';
import curriculumSetMaster from '../routes/curriculum/set-master.route';
import curriculumDelete from '../routes/curriculum/delete.route';
import curriculumPublicGet from '../routes/curriculum/public/cv_id.route';

import educationCreate from '../routes/education/create.route';
import educationGet from '../routes/education/education_id.route';
import educationUpdate from '../routes/education/update.route';
import educationUpdateSet from '../routes/education/update-set.route';
import educationDelete from '../routes/education/delete.route';

import opportunitiesCreate from '../routes/opportunity/create.route';
import opportunitiesSearch from '../routes/opportunity/search.route';
import opportunitiesUpdate from '../routes/opportunity/update.route';
import opportunitiesDelete from '../routes/opportunity/delete.route';

import letterCreate from '../routes/cover-letter/create.route';

import userUpdate from '../routes/user/update.route';
import userMasterCV from '../routes/user/master-cv.route';
import userLanguages from '../routes/user/languages.route';
import userEducations from '../routes/user/educations.route';
import userCVs from '../routes/user/cvs.route';

const SERVER_API_PORT = Number(process.env.SERVER_API_PORT || 8000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.replace(/ /g, '').split(',') : undefined;
const {
   SSL_KEY_PATH,
   SSL_CERT_PATH,
   API_SECRET = 'default_secret',
   REDIS_URL = 'redis://localhost:6379'
} = process.env;

if (isNaN(SERVER_API_PORT)) {
   throw new Error(`Invalid SERVER_API_PORT: ${SERVER_API_PORT}. It must be a number.`);
}

const cookiesMaxAge = 24 * 60 * 60 * 1000; // 1 day
const sslConfig = SSL_KEY_PATH && SSL_CERT_PATH ? {
   keySSLPath: SSL_KEY_PATH,
   certSSLPath: SSL_CERT_PATH
} : undefined;

global.service = new ServerAPI({
   id: 'server-api',
   API_SECRET: API_SECRET,
   projectName: 'feliperamos-api',
   redisURL: REDIS_URL,
   sessionCookiesMaxAge: cookiesMaxAge,
   PORT: SERVER_API_PORT,
   corsOrigin: CORS_ORIGIN,
   sslConfig: sslConfig,
   autoInitialize: true,
   staticFolders: [
      { 
         publicRoot: process.env.PUBLIC_PATH,
         alias: '/static'
      }
   ],
   httpEndpoints: [
      loginRoute,
      authUserRoute,
      healthRoute,
   
      experienceCreate,
      experienceCreateSet,
      experienceQuery,
      experienceGet,
      experienceUpdate,
      experienceUpdateSet,
      experienceDelete,
      experienceGetPublic,

      skillCreate,
      skillCreateSet,
      skillQuery,
      skillGet,
      skillUpdate,
      skillDelete,
      skillUpdateSet,
      skillGetPublic,

      companyCreate,
      companyCreateSet,
      companyUpdate,
      companyUpdateSet,
      companyQuery,
      companyGet,
      companyDelete,

      languageCreate,
      languageGet,
      languageUpdate,
      languageDelete,

      curriculumCreate,
      curriculumCreateSet,
      curriculumUpdate,
      curriculumUpdateSet,
      curriculumGet,
      curriculumSetMaster,
      curriculumDelete,
      curriculumPublicGet,

      educationCreate,
      educationGet,
      educationUpdate,
      educationUpdateSet,
      educationDelete,

      opportunitiesCreate,
      opportunitiesSearch,
      opportunitiesUpdate,
      opportunitiesDelete,

      letterCreate,

      userUpdate,
      userMasterCV,
      userLanguages,
      userEducations,
      userCVs
   ],
   onListen: function () {
      console.log(`Server API is running on port ${this.PORT}`);
   }
});

export default global.service;
