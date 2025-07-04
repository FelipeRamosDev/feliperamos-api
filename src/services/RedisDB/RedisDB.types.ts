/**
 * Redis Database Types and Interfaces
 * 
 * This file contains all TypeScript interfaces and types used in the Redis service layer.
 */

import { RedisOptions } from "ioredis";

/**
 * Represents a collection configuration in the Redis database
 */
export interface Collection {
   name: string;
   schema?: any;
   redisEvents?: {
      preCreate?: Function;
      preRead?: Function;
      preUpdate?: Function;
      preDelete?: Function;
   };
   [key: string]: any;
}

/**
 * Configuration options for setting up the Redis service
 */
export interface RedisServiceSetup {
   serverURL?: string | undefined; // URL of the Redis server, e.g., 'redis://localhost:6379'
   host?: string | undefined; // Hostname of the Redis server
   password?: string | undefined; // Password for Redis authentication
   port?: number | undefined; // Port number for the Redis server
   clientOptions?: RedisOptions;
   collections?: { [key: string]: Collection };
   onConnect?: (...args: any[]) => void;
   onReady?: (...args: any[]) => void;
   onEnd?: (...args: any[]) => void;
   onError?: (err: any, ...args: any[]) => void;
   onReconnecting?: (...args: any[]) => void;
   apiServer?: any;
}

/**
 * Configuration options for document operations (create, update, set, get, delete)
 */
export interface DocSetup {
   collection?: string;
   prefixName?: string;
   uid?: string;
   data?: any;
   field?: string;
   value?: any;
   collectionSet?: Collection;
}

/**
 * Parameters for item operations (set, get, delete)
 */
export interface ItemParams {
   uid?: string;
   key?: string;
   value?: any;
   prefix?: string;
}

/**
 * Context object used in Redis event handlers
 */
export interface RedisEventContext {
   collection: string;
   collectionSet?: {
      redisEvents?: {
         preCreate?: Function;
         preRead?: Function;
         preUpdate?: Function;
         preDelete?: Function;
      };
   };
   [key: string]: any;
}

/**
 * Callback function type for proceeding with operations
 */
export type NextCallback = () => void;

/**
 * Callback function type for rejecting operations with optional error
 */
export type RejectCallback = (error?: any) => void;

/**
 * Standard response interface for Redis operations that return success status
 */
export interface RedisOperationResponse {
   success: boolean;
}

/**
 * Response interface for Redis setItem operation
 */
export interface SetItemResponse {
   success: boolean;
   keyName: string;
   value: any;
}

/**
 * Response interface for Redis setDocField operation
 */
export interface SetDocFieldResponse {
   success: boolean;
   status: number;
}

