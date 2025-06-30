import IORedis from 'ioredis';
import { AI, Cluster, Core, InstanceBase, Microservice, Thread } from '..';
import { EndpointSetup } from './EventEndpoint.types';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const ioRedis = new IORedis(REDIS_URL);

export type InstanceType = Cluster | Thread | Core | InstanceBase | AI | Microservice;

/**
 * Represents an API endpoint configuration.
 * Handles subscription to a Redis channel, message routing, and controller invocation.
 */
class EventEndpoint {
   public path: string;
   public controller: (data: any, done?: () => void) => void;
   private _instance: () => InstanceType | undefined;
   public ioRedis: IORedis;

   /**
    * Constructs an EventEndpoint, subscribes to the Redis channel, and sets up message handling.
    * @param setup - The endpoint configuration object, including path and controller.
    * @param instance - The parent instance (Cluster, Core, or Thread).
    * @throws If path or controller are not provided.
    */
   constructor(setup: EndpointSetup, instance?: InstanceType | undefined) {
      const { path, controller } = setup;

      if (!path) {
         throw {
            name: 'ROUTE_REQUIRED',
            message: 'The "path" param is required to declare a new endpoint!',
         };
      }

      if (typeof controller !== 'function') {
         throw {
            name: 'CONTROLLER_REQUIRED',
            message: 'The "controller" param is required to be a function when declaring a new endpoint!',
         };
      }

      this._instance = () => instance;
      this.ioRedis = ioRedis;

      this.ioRedis.setMaxListeners(0);

      this.path = path;
      this.controller = controller;

      // Subscribe to the Redis channel for this endpoint's path
      this.ioRedis.subscribe(this.path, (err) => {
         if (err) {
            toError(`[EventEndpoint] Error on subscribing the event endpoint: ${this.path}`);
         } else {
            console.log(`[EventEndpoint] Subscribed to event endpoint: ${this.path}`);
         }
      });

      // Listen for messages on the Redis channel and invoke the controller
      this.ioRedis.on('message', (channel: string, message: string) => {
         if (channel !== this.path) {
            return;
         }

         try {
            const data = JSON.parse(message);

            if (data.callbackID) {
               this.controller.call(this, data, (...args: any) => {
                  if (!data.fromPath || !data.callbackID) {
                     return;
                  }

                  this.instance?.sendTo(data.fromPath, { callbackID: data.callbackID, params: args });
               });
            } else {
               this.controller.call(this, data);
            }

         } catch (err) {
            toError(`Something went wrong parsing the arrived message on ioredis event!`);
         }
      });
   }

   /**
    * Retrieves the instance to which this route belongs.
    * @returns The parent instance (Cluster, Core, or Thread).
    */
   get instance(): InstanceType | undefined {
      return this._instance();
   }

   /**
    * Sets a new instance for this route.
    * @param instance - The new parent instance.
    */
   setInstance(instance: InstanceType | undefined): void {
      this._instance = () => instance;
   }
}

export default EventEndpoint;
