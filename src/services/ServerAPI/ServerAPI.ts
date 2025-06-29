
// Declaring globals
import '../../global/globals';

import express, { Express, RequestHandler } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import https from 'https';
import path from 'path';
import fs from 'fs';

// Import Redis services
import { RedisService } from '../RedisDB';
import Microservice from '../Microservice/Microservice';

// Import types
import type {
   Callback,
   ServerAPISetup,
   SSLConfig
} from './ServerAPI.types';
import { Route } from '../Route';

/**
 * @class ServerAPI
 * @module ServerAPI
 * @namespace Services
 * @description Represents the main server class for the API.
 */
class ServerAPI extends Microservice {
   public projectName: string;
   public app_queue: Array<() => void> = [];
   public API_SECRET: string;
   public sessionCookiesMaxAge: number;
   public staticPath?: string;
   public redisURL: string;
   public corsOrigin: string[];
   public jsonLimit: string;
   public sessionResave: boolean;
   public sessionSaveUninitialized: boolean;
   public onReady: Callback;
   public FE_ORIGIN?: string;
   public PORT: number;
   public httpEndpoints: Route[];
   public defaultMaxListeners: number;
   public sslConfig?: SSLConfig;
   public useSSL: boolean = false;
   public isListen?: boolean;
   public serverState?: string;
   public app: Express;
   public rootPath?: string;
   public isSuccess: (customCallback?: Callback) => void;

   private _4handsInstance: () => any;

   /**
    * @constructor
    * @description Creates an instance of ServerAPI.
    */
   constructor(setup: ServerAPISetup, _4handsInstance?: any) {
      super(setup);

      const {
         projectName,
         API_SECRET,
         staticPath,
         sslConfig,
         FE_ORIGIN,

         // Defaults
         PORT = 80,
         jsonLimit = '10mb',
         onReady = () => { },
         httpEndpoints = [],
         defaultMaxListeners = 20,
         sessionCookiesMaxAge = 86400000,
         sessionResave = true,
         sessionSaveUninitialized = true,
         redisURL = 'redis://localhost:6379',
         corsOrigin = ['http://localhost', 'https://localhost']
      } = Object(setup);

      /**
       * The main 4hands-api instance.
       * @type {Object}
       */
      this._4handsInstance = () => _4handsInstance;
      
      this.app = express();
      this.projectName = projectName;
      this.app_queue = [];
      this.API_SECRET = API_SECRET;
      this.sessionCookiesMaxAge = sessionCookiesMaxAge;
      this.staticPath = staticPath;
      this.redisURL = redisURL;
      this.corsOrigin = corsOrigin;
      this.jsonLimit = jsonLimit;
      this.useSSL = false;
      this.sslConfig = sslConfig;
      this.sessionResave = (sessionResave !== undefined) ? sessionResave : true;
      this.sessionSaveUninitialized = (sessionSaveUninitialized !== undefined) ? sessionSaveUninitialized : true;
      this.onReady = onReady;
      this.FE_ORIGIN = FE_ORIGIN;
      this.PORT = PORT || 80;
      this.httpEndpoints = httpEndpoints;
      this.defaultMaxListeners = defaultMaxListeners;

      if (this.defaultMaxListeners) {
         // eslint-disable-next-line @typescript-eslint/no-var-requires
         const events = require('events');
         events.EventEmitter.defaultMaxListeners = this.defaultMaxListeners;
      }

      if (this.sslConfig?.keySSLPath) {
         this.sslConfig.keySSLPath = this.normalizePath(this.sslConfig.keySSLPath);
      }

      if (this.sslConfig?.certSSLPath) {
         this.sslConfig.certSSLPath = this.normalizePath(this.sslConfig.certSSLPath);
      }

      this.isSuccess = (customCallback?: Callback) => {
         try {
            this.runAppQueue();
            this.isListen = true;
            this.serverState = 'online';
            this.onReady.call(this);

            if (typeof customCallback === 'function') {
               customCallback.call(this);
            }
         } catch (err) {
            throw err;
         }
      };


      if (this.sslConfig) {
         this.useSSL = true;
         if (this.PORT === 80) {
            this.PORT = 443;
         }
      }

      this.httpEndpoints.map(endpoint => this.createEndpoint(endpoint));
      this.init().catch(err => {
         throw err;
      });
   }

   // /**
   //  * The DBService object.
   //  * @type {DBService}
   //  */
   // get database() {
   //    return this.parent?.DB;
   // }

   // /**
   //  * The MailService object.
   //  * @type {MailService}
   //  */
   // get mailService() {
   //    return this.parent?.emailService;
   // }

   // /**
   //  * The socketIO object.
   //  * @type {ServerIO}
   //  */
   // get socketIO() {
   //    return this.parent?.IO;
   // }

   get redisService(): RedisService | undefined {
      return this.parent?.Redis;
   }

   get parent() {
      return this._4handsInstance() || {};
   }

   get projectPath(): string {
      return path.normalize(__dirname.replace(path.normalize('/dist/src/services/ServerAPI'), '/'));
   }

   normalizePath(filePath: string): string {
      return path.normalize(this.projectPath + filePath);
   }

   async init(): Promise<void> {
      this.rootPath = path.normalize(__dirname.replace(path.normalize('/dist/src/services'), '/'));
      this.serverState = 'loading';


      // Initializing the Redis DB
      // Dynamically import connect-redis and use it as the session store
      this.app.use(cors({
         origin: this.corsOrigin,
         credentials: true
      }));

      this.app.use(bodyParser.json({ limit: this.jsonLimit }));
      this.app.use(express.json());

      if (this.API_SECRET) {
         let sessionStore;
         if (this.redisService?.client) {
            // Dynamically require connect-redis to avoid import issues
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const RedisStore = require('connect-redis')(session);
            sessionStore = new RedisStore({ client: this.redisService.client });
         }
         this.app.use(session({
            store: sessionStore,
            secret: this.API_SECRET,
            resave: this.sessionResave,
            saveUninitialized: this.sessionSaveUninitialized,
            cookie: {
               secure: this.useSSL, // Set secure to true if using HTTPS
               maxAge: this.sessionCookiesMaxAge
            }
         }));
      } else {
         throw new Error('You need to provide a API SECRET to start the server!');
      }

      if (this.staticPath) {
         this.app.use(express.static(this.rootPath + this.staticPath));
      }

      if (this.useSSL) {
         this.listenSSL(this.PORT, () => this.isSuccess());
      } else {
         this.app.listen(this.PORT, () => this.isSuccess());
      }
   }

   /**
    * Starts the server to listen on the specified port.
    */
   listen(PORT: number, callback?: Callback): void {
      if (!callback) {
         callback = this.isSuccess;
      }

      if (!this.isListen && PORT) {
         this.app?.listen(PORT, () => {
            this.isSuccess(callback);
         });
      }
   }

   /**
    * Starts the server with SSL encryption to listen on the specified port.
    */
   listenSSL(PORT: number, callback?: Callback): void {
      try {
         if (this.PORT || PORT) {
            // Verificação segura antes de usar
            if (!this.sslConfig?.keySSLPath || !this.sslConfig?.certSSLPath) {
               throw new Error('SSL configuration is incomplete. Both keySSLPath and certSSLPath are required.');
            }

            const SSL_KEY = fs.readFileSync(this.sslConfig.keySSLPath);
            const SSL_CERT = fs.readFileSync(this.sslConfig.certSSLPath);

            if (!SSL_KEY || !SSL_CERT) {
               throw new Error(`The SSL certificate wasn't found on the directory!`);
            }

            const options = {
               key: SSL_KEY,
               cert: SSL_CERT
            };

            if (!callback) {
               callback = this.isSuccess;
            }

            https.createServer(options, this.app!).listen(PORT, () => {
               this.PORT = PORT;
               if (typeof callback === 'function') callback();
            });
         }
      } catch (error) {
         throw error;
      }
   }

   runAppQueue(): void {
      this.app_queue.forEach(item => item());
      this.app_queue = [];
   }

   createEndpoint(endpoint: Route): void {
      if (!endpoint || typeof endpoint !== 'object') {
         throw new Error('The "endpoint" param must be a Route instance!');
      }

      if (!endpoint.routePath || typeof endpoint.controller !== 'function') {
         throw new Error('Route must have a valid routePath and controller function!');
      }

      const routePath = endpoint.routePath;
      const middlewares = endpoint.middlewares || [];
      const controller = endpoint.controller;

      switch (endpoint.method) {
         case 'GET': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.get(routePath, ...middlewares, controller));
            } else {
               this.app.get(routePath, ...middlewares, controller);
            }
            return;
         }
         case 'POST': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.post(routePath, ...middlewares, controller));
            } else {
               this.app.post(routePath, ...middlewares, controller);
            }
            return;
         }
         case 'PUT': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.put(routePath, ...middlewares, controller));
            } else {
               this.app.put(routePath, ...middlewares, controller);
            }
            return;
         }
         case 'DELETE': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.delete(routePath, ...middlewares, controller));
            } else {
               this.app.delete(routePath, ...middlewares, controller);
            }
            return;
         }
         case 'PATCH': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.patch(routePath, ...middlewares, controller));
            } else {
               this.app.patch(routePath, ...middlewares, controller);
            }
            return;
         }
         default: {
            throw new Error(`Unsupported HTTP method: ${endpoint.method}`);
         }
      }
   }
}

export default ServerAPI;
