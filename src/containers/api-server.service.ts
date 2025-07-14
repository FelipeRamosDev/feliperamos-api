import 'dotenv/config';

import '../database';
import ServerAPI from '../services/ServerAPI/ServerAPI';
import loginRoute from '../routes/auth/login.route';
import healthRoute from '../routes/health.route';
import authUserRoute from '../routes/auth/user.route';
import experienceCreate from '../routes/experience/create';
import experienceQuery from '../routes/experience/query';
import skillCreate from '../routes/skill/create';
import skillQuery from '../routes/skill/query';
import companyCreate from '../routes/company/create';
import companyQuery from '../routes/company/query';

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
      experienceQuery,
      skillCreate,
      skillQuery,
      companyCreate,
      companyQuery
   ],
   onListen: function () {
      console.log(`Server API is running on port ${this.PORT}`);
   }
});
