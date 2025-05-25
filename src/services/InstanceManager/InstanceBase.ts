import crypto from 'crypto';
import EventEndpoint, { EndpointSetup } from '../../models/EventEndpoint';
import { publishEvent } from '../../helpers';

export interface InstanceBaseSetup {
   id?: string;
   tagName?: string;
   filePath?: string;
   dataStore?: Record<string, any>;
   parent?: InstanceBase;
   routes?: EndpointSetup[];
   onReady?: () => void;
   onData?: (data: any) => void;
   onClose?: () => void;
   onError?: (err: any) => void;
}

/**
 * Represents a base instance with routes, data storage, and lifecycle callbacks.
 */
class InstanceBase {
   public id: string;
   public tagName: string;
   public filePath: string;

   private _dataStore: Map<string, any>;
   private _parent: () => InstanceBase | undefined;
   private _routes: Map<string, EventEndpoint>;

   public callbacks: {
      onReady: () => void;
      onData: (from?: string, data?: any) => void;
      onClose: () => void;
      onError: (err: any) => void;
   };

   constructor(setup: InstanceBaseSetup) {
      const {
         id,
         tagName = '',
         filePath = '',
         onReady = () => {},
         onData = () => {},
         onClose = () => {},
         onError = () => {},
         parent,
      } = setup;

      this._parent = () => parent;
      this._dataStore = new Map();
      this._routes = new Map();

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

   getRoute(path: string): EventEndpoint | undefined {
      return this._routes.get(path);
   }

   setRoute(routeSetup: EndpointSetup): EventEndpoint {
      const route = new EventEndpoint(routeSetup, this);
      this._routes.set(route.path, route);
      return route;
   }

   setParent(newParent: InstanceBase) {
      this._parent = () => newParent;
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

   getCleanOut(): object {
      return JSON.parse(
         JSON.stringify({
            ...this,
            parent: undefined,
         })
      );
   }

   sendTo(path: string, data: any) {
      publishEvent(path, data);
   }
}

export default InstanceBase;
