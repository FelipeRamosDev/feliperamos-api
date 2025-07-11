import 'dotenv/config';

import '../database';
import { Route } from '../services';
import ServerAPI from '../services/ServerAPI/ServerAPI';

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
      new Route({
         routePath: '/health',
         method: 'GET',
         controller: (req, res) => {
            res.status(200).send({ success: true, message: 'Server is running' });
         }
      })
   ],
   onListen: function () {
      console.log(`Server API is running on port ${this.PORT}`);
   }
});
