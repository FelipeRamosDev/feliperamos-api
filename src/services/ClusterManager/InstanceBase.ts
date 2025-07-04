import crypto from 'crypto';
import IORedis from 'ioredis';
import EventEndpoint from '../EventEndpoint/EventEndpoint';
import Cluster from './Cluster';
import Core from './Core';
import Thread from './Thread';

// Types
import { InstanceBaseSetup } from './types/ClusterManager.types';
import { EndpointSetup } from '../EventEndpoint/EventEndpoint.types';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const publisher = new IORedis(REDIS_URL);
if (!global.callbacks) {
   global.callbacks = new Map();
}

/**
 * Represents a base instance with routes, data storage, and lifecycle callbacks.
 * Provides methods for event routing, data storage, parent management, and Redis-based messaging.
 */
class InstanceBase {
   public id: string;
   public tagName: string;
   public filePath: string;
   public ioRedis: IORedis;

   private _dataStore: Map<string, any>;
   private _parent: () => InstanceBase | undefined;
   private _routes: Map<string, EventEndpoint>;

   /**
    * Lifecycle callbacks for the instance.
    * - onReady: Called when the instance is ready.
    * - onData: Called when data is received.
    * - onClose: Called when the instance is closed.
    * - onError: Called when an error occurs.
    */
   public callbacks: {
      onReady: () => void;
      onData: (data: any) => void;
      onClose: () => void;
      onError: (err: any) => void;
   };

   /**
    * Constructs an InstanceBase, sets up Redis subscriptions, and initializes routes and data storage.
    * @param setup - The instance configuration object.
    * @param parent - Optional parent instance (Cluster, Core, or Thread).
    */
   constructor(setup: InstanceBaseSetup = {}, parent?: Cluster | Core | Thread) {
      const {
         id,
         tagName = '',
         filePath = '',
         onReady = () => {},
         onData = () => {},
         onClose = () => {},
         onError = () => {}
      } = setup;

      this._parent = () => parent;
      this._dataStore = new Map();
      this._routes = new Map();

      this.ioRedis = new IORedis(REDIS_URL);
      this.id = id || this.genRandomBytes();
      this.tagName = tagName || this.id;
      this.filePath = filePath;

      this.callbacks = {
         onReady,
         onData,
         onClose,
         onError,
      };

      global.instance = this;

      // Subscribe to Redis channel for this instance's ID
      this.ioRedis.subscribe(this.id, (err) => {
         if (err) {
            toError('Error on subscribing the event endpoint: ' + this.id);
         } else {
            console.log(`[InstanceBase] Subscribed to event endpoint: ${this.id}`);
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
   }

   /**
    * Gets the parent instance, if any.
    */
   get parent(): InstanceBase | undefined {
      return this._parent();
   }

   /**
    * Sets a new parent instance.
    * @param newParent - The new parent instance.
    */
   setParent(newParent: InstanceBase) {
      this._parent = () => newParent;
   }

   /**
    * Retrieves a route by its path.
    * @param path - The route path.
    * @returns The EventEndpoint instance or undefined if not found.
    */
   getRoute(path: string): EventEndpoint | undefined {
      return this._routes.get(path);
   }

   /**
    * Registers a new route.
    * @param routeSetup - The route configuration.
    * @returns The created EventEndpoint instance.
    */
   setRoute(routeSetup: EndpointSetup): EventEndpoint {
      const route = new EventEndpoint(routeSetup, this);

      this._routes.set(route.path, route);
      return route;
   }

   /**
    * Generates a random hexadecimal string.
    * @param bytes - Number of bytes to generate (default: 4).
    * @returns The generated hex string.
    */
   genRandomBytes(bytes: number = 4): string {
      return crypto.randomBytes(bytes).toString('hex');
   }

   /**
    * Returns all values from the internal data store as an object.
    * @returns An object containing all key-value pairs.
    */
   getAllValues(): Record<string, any> {
      const toObj: Record<string, any> = {};
      
      this._dataStore.forEach((item, key) => (toObj[key] = item));
      return toObj;
   }

   /**
    * Retrieves a value from the data store by key.
    * @param key - The key to retrieve.
    * @returns The value associated with the key, or undefined if not found.
    */
   getValue(key: string): any {
      return this._dataStore.get(key);
   }

   /**
    * Sets a value in the data store.
    * @param key - The key to set.
    * @param value - The value to associate with the key.
    * @returns The value that was set.
    */
   setValue(key: string, value: any): any {
      this._dataStore.set(key, value);
      return value;
   }

   /**
    * Deletes a value from the data store by key.
    * @param key - The key to delete.
    */
   deleteValue(key: string) {
      this._dataStore.delete(key);
   }

   /**
    * Triggers the onError callback with the provided error.
    * @param err - The error to handle.
    */
   triggerError(err: any) {
      this.callbacks.onError(err);
   }

   /**
    * Sends data to a specified path, optionally registering a callback for the response.
    * @param path - The destination path.
    * @param data - The data to send.
    * @param callback - Optional callback to handle the response.
    */
   sendTo(path: string, data: any, callback?: (...params: any) => void | Promise<void>) {
      if (callback) {
         const callbackID = this.genRandomBytes();

         callbacks.set(callbackID, callback);
         data.callbackID = callbackID;
         data.fromPath = instance.id;
      }

      this.publishEvent(path, data);
   }

   /**
    * Publishes an event to the specified Redis channel.
    * @param eventName - The name of the event/channel.
    * @param data - The data to publish.
    */
   publishEvent(eventName: string, data: any) {
      let dataString: string;
   
      try {
         dataString = JSON.stringify(data);
      } catch (err) {
         return;
      }

      publisher.publish(eventName, dataString);
   }
}

export default InstanceBase;
