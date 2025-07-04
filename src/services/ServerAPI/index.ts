/**
 * ServerAPI Service - Entry Point
 * 
 * This file exports the ServerAPI service and related types
 * for easy importing throughout the application.
 */

// Main service class
export { default as ServerAPI } from './ServerAPI';

// Types and interfaces
export type {
   Callback,
   ServerAPISetup,
   RouteConfig
} from './ServerAPI.types';
