import IORedis from 'ioredis';
import Cluster from '../services/ClusterManager';
import Core from '../services/ClusterManager/Core';
import Thread from '../services/ClusterManager/Thread';
import { EndpointSetup } from './types/EventEndpoint.types';

const ioRedis = new IORedis();



type InstanceBase = any; // Replace `any` with the actual type if known

/**
 * Represents an API endpoint configuration.
 */
class EventEndpoint {
   public path: string;
   public controller: (data: any) => void;
   private _instance: () => Cluster | Thread | Core;
   public ioRedis: IORedis;

   constructor(setup: EndpointSetup, instance: InstanceBase) {
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

      this.ioRedis.subscribe(this.path, (err) => {
         if (err) {
            console.error({
               name: 'EVENT_ENDPOINT_SUBSCRIBE',
               message: 'Error on subscribing the event endpoint: ' + this.path,
            });
         } else {
            console.log(`Subscribed to event endpoint: ${this.path}`);
         }
      });

      this.ioRedis.on('message', (channel: string, message: string) => {
         if (channel !== this.path) return;

         try {
            const data = JSON.parse(message);
            this.controller.call(this, data);
         } catch (err) {
            console.error(err);
         }
      });
   }

   /**
    * Retrieves the instance to which this route belongs.
    */
   get instance(): InstanceBase {
      return this._instance();
   }

   /**
    * Sets a new instance for this route.
    */
   setInstance(instance: InstanceBase): void {
      this._instance = () => instance;
   }
}

export default EventEndpoint;
