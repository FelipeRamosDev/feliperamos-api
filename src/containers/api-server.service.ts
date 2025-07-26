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
import experienceGetPublic from '../routes/experience/public/user-experiences.route';

import skillCreate from '../routes/skill/create.route';
import skillCreateSet from '../routes/skill/create-set.route';
import skillQuery from '../routes/skill/query.route';
import skillGet from '../routes/skill/skill_id.route';
import skillUpdate from '../routes/skill/update.route';
import skillUpdateSet from '../routes/skill/update-set.route';
import skillGetPublic from '../routes/skill/public/user-skills.route';

import companyCreate from '../routes/company/create.route';
import companyCreateSet from '../routes/company/create-set.route';
import companyQuery from '../routes/company/query.route';
import companyUpdate from '../routes/company/update.route';
import companyUpdateSet from '../routes/company/update-set.route';
import companyGet from '../routes/company/company_id.route';

import curriculumCreate from '../routes/curriculum/create.route';
import curriculumCreateSet from '../routes/curriculum/create-set.route';
import curriculumGet from '../routes/curriculum/cv_id.route';
import curriculumUpdate from '../routes/curriculum/update.route';
import curriculumUpdateSet from '../routes/curriculum/update-set.route';
import curriculumUserCVs from '../routes/curriculum/user-cvs.route';

const SERVER_API_PORT = Number(process.env.SERVER_API_PORT || 8000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : undefined;
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

export default new ServerAPI({
   id: 'server-api',
   API_SECRET: API_SECRET,
   projectName: 'feliperamos-api',
   redisURL: REDIS_URL,
   sessionCookiesMaxAge: cookiesMaxAge,
   PORT: SERVER_API_PORT,
   corsOrigin: CORS_ORIGIN,
   sslConfig: sslConfig,
   autoInitialize: true,
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
      experienceGetPublic,
      skillCreate,
      skillCreateSet,
      skillQuery,
      skillGet,
      skillUpdate,
      skillUpdateSet,
      skillGetPublic,
      companyCreate,
      companyCreateSet,
      companyUpdate,
      companyUpdateSet,
      companyQuery,
      companyGet,
      curriculumCreate,
      curriculumCreateSet,
      curriculumGet,
      curriculumUpdate,
      curriculumUpdateSet,
      curriculumUserCVs
   ],
   onListen: function () {
      console.log(`Server API is running on port ${this.PORT}`);
   }
});
