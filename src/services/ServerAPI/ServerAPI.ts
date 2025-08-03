
// Declaring globals
import '../../global/globals';

import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
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
import ErrorServerAPI from './models/ErrorServerAPI';
import { createDirIfNotExists } from '../../helpers/fs.helpers';
import StaticFolder from './StaticFolder';

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
   public staticFolders: StaticFolder[];
   public redisURL: string;
   public corsOrigin: string[];
   public jsonLimit: string;
   public sessionResave: boolean;
   public sessionSaveUninitialized: boolean;
   public onConstructed: Callback;
   public onInitialized: Callback;
   public onListen: Callback;
   public FE_ORIGIN?: string;
   public PORT: number;
   public autoInitialize: boolean;
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
         API_SECRET,
         sslConfig,
         FE_ORIGIN,
         
         // Defaults
         projectName = 'default-server',
         PORT = 80,
         jsonLimit = '10mb',
         staticFolders = [],
         autoInitialize = false,
         onConstructed = () => { },
         onInitialized = () => { },
         onListen = () => { },
         httpEndpoints = [],
         defaultMaxListeners = 20,
         sessionCookiesMaxAge = 86400000,
         sessionResave = true,
         sessionSaveUninitialized = true,
         redisURL = 'redis://localhost:6379',
         corsOrigin = ['http://localhost', 'https://localhost']
      } = setup;

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
      this.staticFolders = staticFolders.map(folderConfig => new StaticFolder(folderConfig));
      this.redisURL = redisURL;
      this.corsOrigin = corsOrigin;
      this.jsonLimit = jsonLimit;
      this.useSSL = false;
      this.sslConfig = sslConfig;
      this.sessionResave = (sessionResave !== undefined) ? sessionResave : true;
      this.sessionSaveUninitialized = (sessionSaveUninitialized !== undefined) ? sessionSaveUninitialized : true;
      this.autoInitialize = autoInitialize;
      this.onConstructed = onConstructed;
      this.onInitialized = onInitialized;
      this.onListen = onListen;
      this.FE_ORIGIN = FE_ORIGIN;
      this.PORT = PORT || 80;
      this.httpEndpoints = httpEndpoints;
      this.defaultMaxListeners = defaultMaxListeners;

      if (this.defaultMaxListeners) {
         // eslint-disable-next-line @typescript-eslint/no-var-requires
         const events = require('events');
         events.EventEmitter.defaultMaxListeners = this.defaultMaxListeners;
      }

      this.isSuccess = () => {
         try {
            this.runAppQueue();
            this.isListen = true;
            this.serverState = 'online';
            this.onListen.call(this);
         } catch (err) {
            throw err;
         }
      };

      this.normalizeSSLPath();
      if (this.sslConfig) {
         this.useSSL = true;
         if (this.PORT === 80) {
            this.PORT = 443;
         }
      }

      // Routes will be registered after middleware setup in init()
      if (this.autoInitialize) {
         this.init().catch(err => {
            throw err;
         });
      }

      this.onConstructed.call(this);
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

   get prodPath(): string {
      return process.env.NODE_ENV === 'production' ? '/dist' : '';
   }

   get redisService(): RedisService | undefined {
      return this.parent?.Redis;
   }

   get parent() {
      return this._4handsInstance() || {};
   }

   get projectPath(): string {
      return path.normalize(__dirname.replace(path.normalize(`${this.prodPath}/src/services/ServerAPI`), '/'));
   }

   normalizePath(filePath: string): string {
      return path.normalize(this.projectPath + filePath);
   }

   normalizeSSLPath(): void {
      if (!this.sslConfig || typeof this.sslConfig !== 'object') {
         return;
      }

      if (this.sslConfig.keySSLPath) {
         this.sslConfig.keySSLPath = this.normalizePath(this.sslConfig.keySSLPath);
      }

      if (this.sslConfig.certSSLPath) {
         this.sslConfig.certSSLPath = this.normalizePath(this.sslConfig.certSSLPath);
      }
   }

   buildStaticAlias(pathConfig: StaticFolder): string {
      if (!(pathConfig instanceof StaticFolder)) {
         throw new ErrorServerAPI('The "pathConfig" param must be a StaticFolder object!', 'INVALID_PATH_CONFIG');
      }

      return `/${(pathConfig.alias || pathConfig.path).split('/').filter(Boolean).join('/')}`;
   }

   async init(): Promise<void> {
      this.rootPath = path.normalize(__dirname.replace(path.normalize(`${this.prodPath}/src/services`), '/'));
      this.serverState = 'loading';

      this.app.use(express.json({ limit: this.jsonLimit }));
      this.app.use(cookieParser());
      this.app.use(cors({
         origin: this.corsOrigin,
         credentials: true
      }));

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
               maxAge: this.sessionCookiesMaxAge,
               httpOnly: true, // Allow JavaScript access if needed
               sameSite: this.useSSL ? 'none' : 'lax' // Adjust based on your setup
            }
         }));
      } else {
         throw new ErrorServerAPI('You need to provide a API SECRET to start the server!', 'API_SECRET_REQUIRED');
      }

      // Initialize static folders
      this.staticFolders.forEach(pathConfig => this.initStaticFolder(pathConfig));

      // Register routes after all middleware is set up
      this.httpEndpoints.forEach(endpoint => this.createEndpoint(endpoint));

      if (this.useSSL) {
         this.listenSSL();
      } else {
         this.listen();
      }

      this.onInitialized.call(this);
   }

   initStaticFolder(pathConfig: StaticFolder): void {
      if (!(pathConfig instanceof StaticFolder)) {
         throw new ErrorServerAPI('The "pathConfig" param must be a StaticFolder object!', 'INVALID_PATH_CONFIG');
      }

      try {
         const { path: folderPath, alias } = pathConfig;
   
         createDirIfNotExists(folderPath);
         this.app.use(alias, express.static(folderPath));
      } catch (error: any) {
         throw new ErrorServerAPI(`Failed to set static folder: ${error.message}`, 'STATIC_FOLDER_ERROR');
      }
   }

   /**
    * Starts the server to listen on the specified port.
    */
   listen(): void {
      this.app.listen(this.PORT, () => this.isSuccess());
   }

   /**
    * Starts the server with SSL encryption to listen on the specified port.
    */
   listenSSL(): void {
      try {
         // Verificação segura antes de usar
         if (!this.sslConfig?.keySSLPath || !this.sslConfig?.certSSLPath) {
            throw new ErrorServerAPI('SSL configuration is missing key or cert paths!', 'SSL_CONFIG_ERROR');
         }

         const SSL_KEY = fs.readFileSync(this.sslConfig.keySSLPath);
         const SSL_CERT = fs.readFileSync(this.sslConfig.certSSLPath);

         if (!SSL_KEY || !SSL_CERT) {
            throw new ErrorServerAPI('The SSL certificate wasn\'t found in the directory!', 'SSL_CERTIFICATE_NOT_FOUND');
         }

         const options = {
            key: SSL_KEY,
            cert: SSL_CERT
         };

         https.createServer(options, this.app!).listen(this.PORT, () => this.isSuccess());
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
         throw new ErrorServerAPI('The "endpoint" param must be a Route instance!', 'INVALID_ENDPOINT');
      }

      if (!endpoint.routePath || typeof endpoint.controller !== 'function') {
         throw new ErrorServerAPI('Route must have a valid routePath and controller function!', 'INVALID_ROUTE');
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
         case 'OPTIONS': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.options(routePath, ...middlewares, controller));
            } else {
               this.app.options(routePath, ...middlewares, controller);
            }
            return;
         }
         case 'HEAD': {
            if (!this.app) {
               this.app_queue.push(() => this.app?.head(routePath, ...middlewares, controller));
            } else {
               this.app.head(routePath, ...middlewares, controller);
            }
            return;
         }
         default: {
            throw new ErrorServerAPI(`Unsupported HTTP method: ${endpoint.method}`, 'UNSUPPORTED_HTTP_METHOD');
         }
      }
   }
}

export default ServerAPI;
