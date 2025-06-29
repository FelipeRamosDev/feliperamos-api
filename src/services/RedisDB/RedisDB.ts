import Redis from 'ioredis';
import crypto from 'crypto';
import RedisEventEmitters from './RedisEventEmmiters';
import { buildKey, parseDocToSave, parseDocToRead } from './RedisHelpers';
import type {
   Collection,
   RedisServiceSetup,
   DocSetup,
   ItemParams,
   SetItemResponse,
   SetDocFieldResponse,
   RedisOperationResponse
} from './RedisDB.types';

// Helper function to create error objects
function logError(error: any, ...args: any[]): Error {
   if (error instanceof Error) {
      return error;
   }

   return new Error(String(error));
}

// Helper function to convert to error
function toError(input: any): Error {
   if (input instanceof Error) {
      return input;
   }

   return new Error(String(input));
}

/**
 * A class representing a Redis service for handling data operations.
 */
class RedisDB {
   public client: Redis;
   public collections: { [key: string]: Collection };
   public serverURL?: string;
   public host?: string;
   public password?: string;
   public port?: number;

   private _apiServer: () => any;
   private _4handsAPI: () => any;

   /**
    * Creates an instance of RedisDB.
    * 
    * @constructor
    * @param {RedisServiceSetup} setup - Configuration options for the Redis service.
    * @param {any} _4handsAPI - The 4HandsAPI instance.
    */
   constructor(setup?: RedisServiceSetup, _4handsAPI?: any) {
      const {
         clientOptions,
         serverURL,
         host,
         password,
         port,
         collections = {},
         onConnect = () => { },
         onReady = () => { },
         onEnd = () => { },
         onError = () => { },
         onReconnecting = () => { },
         apiServer
      } = setup || {};

      try {
         this._apiServer = () => apiServer;
         this._4handsAPI = () => _4handsAPI;

         this.collections = collections;
         this.serverURL = serverURL;
         this.host = host;
         this.password = password;
         this.port = port;

         if (this.serverURL && !this.host) {
            const url = new URL(this.serverURL);

            if (!url.protocol.startsWith('redis')) {
               throw new Error(`Invalid Redis URL protocol: ${url.protocol}. It must start with 'redis'.`);
            }

            this.host = url.hostname;
            this.port = Number(url.port); // Default Redis port is 6379
         }

         this.client = new Redis({
            host: this.host,
            port: this.port,
            password: this.password,
            enableReadyCheck: true, // Ensures the client waits for the Redis server to be ready
            ...clientOptions,
         });

         this.addListener('connect', (...args: any[]) => onConnect.call(this, ...args));
         this.addListener('ready', (...args: any[]) => onReady.call(this, ...args));
         this.addListener('end', (...args: any[]) => onEnd.call(this, ...args));
         this.addListener('error', (err: any, ...args: any[]) => onError.call(this, err, ...args));
         this.addListener('reconnecting', (...args: any[]) => onReconnecting.call(this, ...args));
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * The 4HandsAPI instance that this Redis is under.
    * @readonly
    */
   get instance() {
      return this._4handsAPI();
   }

   /**
    * The ServerAPI instance that this Redis is associated, if it have one.
    * @readonly
    */
   get apiServer() {
      return this._apiServer();
   }

   /**
    * Asynchronously connects to the Redis server.
    * 
    * @async
    * @function connect
    * @returns {Promise<Object>} A promise that resolves to the RedisDB instance.
    * @throws {Error} Will throw an error if connection fails.
    */
   async connect() {
      try {
         await this.client.connect();
         return this;
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously disconnects from the Redis server.
    * 
    * @async
    * @function disconnect
    * @returns {Promise<any>} A promise that resolves when disconnection is successful.
    * @throws {Error} Will throw an error if disconnection fails.
    */
   async disconnect(): Promise<any> {
      try {
         return await this.client.disconnect();
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Adds an event listener to the Redis client.
    * 
    * @function addListener
    * @param {string} evName - The name of the event to listen for.
    * @param {Function} callback - The callback function to execute when the event occurs.
    */
   addListener(evName: string, callback: (...args: any[]) => void): void {
      if (typeof callback === 'function') {
         this.client.on(evName, callback);
      }
   }

   /**
    * Asynchronously sets an item in the Redis client with a unique identifier.
    * 
    * @async
    * @function setItem
    * @param {ItemParams} params - An object containing the parameters.
    * @returns {Promise<SetItemResponse>} A promise that resolves to an object with a success property.
    * @throws {Error} Will throw an error if setting the item fails.
    */
   async setItem(params: ItemParams): Promise<SetItemResponse> {
      let { uid, value, prefix } = params || {};

      try {
         if (typeof uid !== 'string') {
            uid = crypto.randomBytes(10).toString('hex');
         }

         const keyName = buildKey(prefix, uid);
         let parsedValue = value;

         if (typeof value === 'object') {
            parsedValue = JSON.stringify(parsedValue);
         }

         await this.client.set(keyName, parsedValue);
         return { success: true, keyName, value };
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously retrieves an item from the Redis client.
    * 
    * @async
    * @function getItem
    * @param {ItemParams} params - An object containing the parameters.
    * @returns {Promise<any>} A promise that resolves to the retrieved item.
    * @throws {Error} Will throw an error if retrieval fails.
    */
   async getItem(params: ItemParams): Promise<any> {
      const { key, prefix } = params || {};

      try {
         if (typeof key !== 'string') {
            return;
         }

         const keyName = buildKey(prefix, key);
         const value = await this.client.get(keyName);

         if (value === null) {
            return null;
         }

         if (!isNaN(Number(value))) {
            return Number(value);
         }

         try {
            const parsed = JSON.parse(value);
            return parsed;
         } catch (error) {
            return value;
         }
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously deletes an item.
    * 
    * @param {ItemParams} params - The parameters for the item to be deleted.
    * @returns {Promise<number>} A promise that resolves when the item is deleted.
    * @throws {Error} If an error occurs during deletion.
    */
   async deleteItem(params: ItemParams): Promise<number> {
      try {
         const { key, prefix } = params || {};

         if (typeof key !== 'string') {
            return 0;
         }

         const keyName = buildKey(prefix, key);
         return await this.client.del(keyName);
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously creates a document in the Redis client.
    * 
    * @async
    * @function createDoc
    * @param {DocSetup} setup - Configuration options for creating the document.
    * @returns {Promise<RedisOperationResponse>} A promise that resolves to an object with a success property.
    * @throws {Error} Will throw an error if document creation fails.
    */
   async createDoc(setup: DocSetup): Promise<RedisOperationResponse> {
      let { collection, uid, data } = setup || {};

      if (!uid) {
         uid = crypto.randomBytes(10).toString('hex');
      }

      if (!collection) {
         collection = 'default';
      }

      try {
         await new Promise<void>((resolve, reject) => {
            const setupWithCollection = {
               ...setup,
               collection,
               collectionSet: this.getCollection(collection) || undefined
            };
            RedisEventEmitters.preCreate.call(setupWithCollection as any, () => resolve(), reject);
         });

         const created = await this.setDoc({ collection, uid, data });
         RedisEventEmitters.postCreate.call({
            ...setup,
            collection,
            collectionSet: this.getCollection(collection) || undefined
         } as any);
         return created;
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously updates a document in the Redis client.
    * 
    * @async
    * @function updateDoc
    * @param {DocSetup} setup - Configuration options for updating the document.
    * @returns {Promise<any>} A promise that resolves to the updated data.
    * @throws {Error} Will throw an error if document update fails.
    */
   async updateDoc(setup: DocSetup): Promise<any> {
      const { collection = 'default', uid = '', data = {} } = setup || {};

      try {
         await new Promise<void>((resolve, reject) => {
            const setupWithCollection = {
               ...setup,
               collection,
               collectionSet: this.getCollection(collection) || undefined
            };
            RedisEventEmitters.preUpdate.call(setupWithCollection as any, () => resolve(), reject);
         });

         const ready = await this.setDoc({ collection, uid, data });
         if (!ready) {
            throw toError('Failed to set document');
         }

         RedisEventEmitters.postUpdate.call({
            ...setup,
            data,
            collection,
            collectionSet: this.getCollection(collection) || undefined
         } as any);
         return data;
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously sets a document in the Redis client.
    * 
    * @async
    * @function setDoc
    * @param {DocSetup} setup - Configuration options for setting the document.
    * @returns {Promise<RedisOperationResponse>} A promise that resolves to an object with a success property.
    * @throws {Error} Will throw an error if setting the document fails.
    */
   async setDoc(setup: DocSetup): Promise<RedisOperationResponse> {
      const { prefixName, uid, data } = setup || {};
      let { collection } = setup || {};
      const setters: Promise<any>[] = [];

      try {
         if (collection && typeof collection !== 'string') {
            throw logError('Invalid collection parameter - must be a string');
         }

         if (!uid || typeof uid !== 'string') {
            throw logError('Invalid uid parameter - must be a string');
         }

         if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return { success: false };
         }

         let parsedValue: Record<string, any>;
         if (!collection) {
            collection = prefixName || '';
            parsedValue = parseDocToSave(null, data);
         } else {
            parsedValue = parseDocToSave(this.getCollection(collection) || null, data);
         }

         Object.keys(parsedValue).forEach(key => {
            setters.push(this.setDocField({ collection, uid, field: key, value: parsedValue[key] }));
         });

         await Promise.all(setters);
         return { success: true };
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously retrieves a document from the Redis client.
    * 
    * @async
    * @function getDoc
    * @param {DocSetup} setup - Configuration options for retrieving the document.
    * @returns {Promise<any>} A promise that resolves to the retrieved document.
    * @throws {Error} Will throw an error if retrieval fails.
    */
   async getDoc(setup: DocSetup): Promise<any> {
      const { prefixName, collection, uid } = setup || {};

      try {
         const doc = await this.client.hgetall(buildKey(collection || prefixName, uid));

         if (!Object.keys(doc).length) {
            return;
         }

         return parseDocToRead(this.getCollection(collection) || null, doc);
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously sets a field in a document in the Redis client.
    * 
    * @async
    * @function setDocField
    * @param {DocSetup} setup - Configuration options for setting the field.
    * @returns {Promise<SetDocFieldResponse>} A promise that resolves to an object with a success property.
    * @throws {Error} Will throw an error if setting the field fails.
    */
   async setDocField(setup: DocSetup): Promise<SetDocFieldResponse> {
      const { collection, uid, field } = setup || {};
      const { value } = setup || {};

      try {
         if (collection && typeof collection !== 'string') {
            throw logError('Invalid collection parameter - must be a string');
         }

         if (!uid || typeof uid !== 'string') {
            throw logError('Invalid uid parameter - must be a string');
         }

         if (!field || typeof field !== 'string') {
            throw logError('Invalid field parameter - must be a string');
         }

         if (!value) {
            return { success: false, status: 0 };
         }

         const ready = await this.client.hset(buildKey(collection, uid), field, value);
         return { success: true, status: ready };
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Asynchronously deletes a document from the Redis client.
    * 
    * @async
    * @function deleteDoc
    * @param {DocSetup} setup - Configuration options for deleting the document.
    * @returns {Promise<RedisOperationResponse>} A promise that resolves to an object with a success property.
    * @throws {Error} Will throw an error if deletion fails.
    */
   async deleteDoc(setup: DocSetup): Promise<RedisOperationResponse> {
      const { collection, uid } = setup || {};
      const key = buildKey(collection, uid);
      const promises: Promise<number>[] = [];

      try {
         const keys = await this.client.hkeys(key);
         await new Promise<void>((resolve, reject) => {
            const setupWithCollection = { ...setup, collectionSet: this.getCollection(collection) };
            if (collection) {
               RedisEventEmitters.preDelete.call({ ...setupWithCollection, collection }, () => resolve(), reject);
            } else {
               resolve();
            }
         });

         keys.forEach((curr: string) => promises.push(this.client.hdel(key, curr)));

         const results = await Promise.all(promises);
         if (collection) {
            RedisEventEmitters.postDelete.call({ ...setup, collectionSet: this.getCollection(collection), collection });
         }

         if (results.every(success => success)) {
            return { success: true };
         }
         return { success: false };
      } catch (err) {
         throw logError(err);
      }
   }

   /**
    * Retrieves a collection by its name from the collections object.
    * @param {string} collectionName - The name of the collection to retrieve.
    * @returns {Collection|undefined} The collection object if found, or undefined if not found.
    */
   getCollection(collectionName?: string): Collection | undefined {
      if (!collectionName) {
         return undefined;
      }
      return this.collections[collectionName];
   }
}

export default RedisDB;
