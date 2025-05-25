import Cluster from '../services/InstanceManager';
import Core from '../services/InstanceManager/Core';
import Thread from '../services/InstanceManager/Thread';
import ErrorLog from './ErrorLog';
import IORedis from 'ioredis';

const ioRedis = new IORedis();
const logError = ErrorLog.logError;

export interface EndpointSetup {
   root?: string;
   path: string;
   controller: (data: any) => void;
}

type InstanceBase = any; // Replace `any` with the actual type if known

/**
 * Represents an API endpoint configuration.
 */
class EventEndpoint {
   public root?: string;
   public path: string;
   public controller: (data: any) => void;
   private _instance: () => Cluster | Thread | Core;
   public ioRedis: IORedis;

   constructor(setup: EndpointSetup, instance: InstanceBase) {
      const { root, path, controller } = setup;

      if (!path) {
         throw logError({
            name: 'ROUTE_REQUIRED',
            message: 'The "path" param is required to declare a new endpoint!',
         });
      }

      if (typeof controller !== 'function') {
         throw logError({
            name: 'CONTROLLER_REQUIRED',
            message: 'The "controller" param is required to be a function when declaring a new endpoint!',
         });
      }

      this._instance = () => instance;
      this.ioRedis = ioRedis;

      this.ioRedis.setMaxListeners(0);

      this.root = root;
      this.path = path;
      this.controller = controller;

      this.ioRedis.subscribe(this.fullPath, (err) => {
         if (err) {
            logError({
               name: 'EVENT_ENDPOINT_SUBSCRIBE',
               message: 'Error on subscribing the event endpoint: ' + this.fullPath,
            });
         } else {
            console.log(`Subscribed to event endpoint: ${this.fullPath}`);
         }
      });

      this.ioRedis.on('message', (channel: string, message: string) => {
         if (channel !== this.fullPath) return;

         try {
            const data = JSON.parse(message);
            this.controller.call(this, data);
         } catch (err) {
            logError(err);
         }
      });
   }

   /**
    * Retrieves the instance to which this route belongs.
    */
   get instance(): InstanceBase {
      return this._instance();
   }

   get fullPath(): string {
      return `${this.root ? this.root : ''}${this.path}`;
   }

   /**
    * Sets a new instance for this route.
    */
   setInstance(instance: InstanceBase): void {
      this._instance = () => instance;
   }
}

export default EventEndpoint;
