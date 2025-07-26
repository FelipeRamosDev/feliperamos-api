import 'dotenv/config';

import '../database';
import ServerAPI from '../services/ServerAPI/ServerAPI';

import healthRoute from '../routes/health.route';

import loginRoute from '../routes/auth/login.route';
import authUserRoute from '../routes/auth/user.route';

import experienceCreate from '../routes/experience/create';
import experienceCreateSet from '../routes/experience/create-set';
import experienceQuery from '../routes/experience/query';
import experienceUpdate from '../routes/experience/update';
import experienceUpdateSet from '../routes/experience/update-set';
import experienceGet from '../routes/experience/experience_id';
import experienceGetPublic from '../routes/experience/public/user-experiences';

import skillCreate from '../routes/skill/create';
import skillCreateSet from '../routes/skill/create-set';
import skillQuery from '../routes/skill/query';
import skillGet from '../routes/skill/skill_id';
import skillUpdate from '../routes/skill/update';
import skillUpdateSet from '../routes/skill/update-set';
import skillGetPublic from '../routes/skill/public/user-skills';

import companyCreate from '../routes/company/create';
import companyCreateSet from '../routes/company/create-set';
import companyQuery from '../routes/company/query';
import companyUpdate from '../routes/company/update';
import companyUpdateSet from '../routes/company/update-set';
import companyGet from '../routes/company/company_id';

import curriculumCreate from '../routes/curriculum/create';
import curriculumUserCVs from '../routes/curriculum/user-cvs';

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
      curriculumUserCVs
   ],
   onListen: function () {
      console.log(`Server API is running on port ${this.PORT}`);
   }
});
