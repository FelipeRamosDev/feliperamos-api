import crypto from 'crypto';
import IORedis from 'ioredis';
import EventEndpoint from '../../models/EventEndpoint';
import Cluster from './Cluster';
import Core from './Core';
import Thread from './Thread';

// Types
import { InstanceBaseSetup } from '../types/ClusterManager.types';
import { EndpointSetup } from '../../models/types/EventEndpoint.types';

/**
 * Represents a base instance with routes, data storage, and lifecycle callbacks.
 */
class InstanceBase {
   public id: string;
   public tagName: string;
   public filePath: string;
   public ioRedis: IORedis;

   private _dataStore: Map<string, any>;
   private _parent: () => InstanceBase | undefined;
   private _routes: Map<string, EventEndpoint>;

   public callbacks: {
      onReady: () => void;
      onData: (data: any) => void;
      onClose: () => void;
      onError: (err: any) => void;
   };

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

      this.ioRedis = new IORedis();
      this.id = id || this.genRandomBytes();
      this.tagName = tagName || this.id;
      this.filePath = filePath;

      this.callbacks = {
         onReady,
         onData,
         onClose,
         onError,
      };
   }

   get parent(): InstanceBase | undefined {
      return this._parent();
   }

   setParent(newParent: InstanceBase) {
      this._parent = () => newParent;
   }

   getRoute(path: string): EventEndpoint | undefined {
      return this._routes.get(path);
   }

   setRoute(routeSetup: EndpointSetup): EventEndpoint {
      const route = new EventEndpoint(routeSetup, this);

      this._routes.set(route.path, route);
      return route;
   }

   genRandomBytes(bytes: number = 4): string {
      return crypto.randomBytes(bytes).toString('hex');
   }

   getAllValues(): Record<string, any> {
      const toObj: Record<string, any> = {};
      
      this._dataStore.forEach((item, key) => (toObj[key] = item));
      return toObj;
   }

   getValue(key: string): any {
      return this._dataStore.get(key);
   }

   setValue(key: string, value: any): any {
      this._dataStore.set(key, value);
      return value;
   }

   deleteValue(key: string): void {
      this._dataStore.delete(key);
   }

   triggerError(err: any): void {
      this.callbacks.onError(err);
   }

   sendTo(path: string, data: any) {
      this.publishEvent(path, data);
   }

   publishEvent(eventName: string, data: any) {
      let dataString: string;
   
      try {
         dataString = JSON.stringify(data);
      } catch (err) {
         return;
      }
   
      this.ioRedis.publish(eventName, dataString);
   }
}

export default InstanceBase;
