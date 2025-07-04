/**
 * Redis Database Services - Entry Point
 * 
 * This file exports all Redis-related services, utilities, and types
 * for easy importing throughout the application.
 */

// Main service class
export { default as RedisService } from './RedisDB';
export { default as RedisEventEmitters } from './RedisEventEmmiters';

// Helper functions
export { buildKey, parseDocToSave, parseDocToRead } from './RedisHelpers';

// Types and interfaces
export type {
   Collection,
   RedisServiceSetup,
   DocSetup,
   ItemParams,
   RedisEventContext,
   NextCallback,
   RejectCallback,
   RedisOperationResponse,
   SetItemResponse,
   SetDocFieldResponse
} from './RedisDB.types';
