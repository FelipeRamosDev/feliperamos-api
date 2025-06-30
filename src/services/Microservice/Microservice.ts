import IORedis from 'ioredis';
import crypto from 'crypto';
import EventEndpoint from '../../services/EventEndpoint/EventEndpoint';
import { MicroserviceSetup } from './Microservice.types';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const publisher = new IORedis(REDIS_URL);
if (!global.callbacks) {
   global.callbacks = new Map();
}

export default class Microservice {
   private _routes: Map<string, EventEndpoint>;

   public id: string;
   public containerName?: string;
   public ioRedis: IORedis;
   public onServiceReady: () => void;
   public onError: (error: any) => void;

   constructor(setup: MicroserviceSetup) {
      const { id, containerName, endpoints = [], onServiceReady = () => {}, onError = () => {} } = setup || {};

      this._routes = new Map();
      this.id = id || containerName || this.genRandomBytes();
      this.containerName = containerName || this.id;
      this.ioRedis = new IORedis(REDIS_URL);
      this.onServiceReady = onServiceReady;
      this.onError = onError;

      // Setting event endpoints
      endpoints.map(endpoint => this.setRoute(endpoint));

      this.createCallbackEvents();
      this.onServiceReady.call(this);
   }

   getRoute(path: string): EventEndpoint | undefined {
      if (typeof path !== 'string') {
         throw new Error('Path must be a string');
      }

      return this._routes.get(path);
   }

   setRoute(route: EventEndpoint) {
      if (!(route instanceof EventEndpoint)) {
         throw new Error('Route must be an instance of EventEndpoint');
      }

      route.setInstance(this);
      this._routes.set(route.path, route);
   }

   createCallbackEvents() {
      // Subscribe to Redis channel for this instance's ID
      this.ioRedis.subscribe(this.id, (err) => {
         if (err) {
            throw new Error('Error on subscribing the event endpoint: ' + this.id);
         } else {
            console.log(`[${this.containerName}] Subscribed to service callbacks channel`);
         }
      });

      // Listen for messages on the Redis channel and trigger callbacks
      this.ioRedis.on('message', (channel: string, message: string) => {
         if (channel !== this.id) {
            return;
         }

         try {
            const data = JSON.parse(message);
            const callback = callbacks.get(data.callbackID);

            if (typeof callback !== 'function') {
               return;
            }

            callback.call(this, ...data.params);
         } catch (err) {
            toError(`Something went wrong when parsing message coming from the ioredis event! Error caught.`);
         }
      });

      this.ioRedis.on('error', (...args) => this.onError(...args));
   }

   genRandomBytes(bytes: number = 4): string {
      return crypto.randomBytes(bytes).toString('hex');
   }

   sendTo(path: string, data: any, callback?: (...params: any) => void | Promise<void>) {
      if (callback) {
         const callbackID = this.genRandomBytes();

         callbacks.set(callbackID, callback);
         data.callbackID = callbackID;
         data.fromPath = this.id;
      }

      this.publishEvent(path, data);
   }

   publishEvent(eventName: string, data: any) {
      let dataString: string;
   
      try {
         dataString = JSON.stringify(data);
      } catch (err) {
         return;
      }

      publisher.publish(eventName, dataString);
   }

   log(...args: any[]) {
      console.log(`[${this.containerName}]`, ...args);
   }
}
