/**
 * Route Service - Entry Point
 * 
 * This file exports the Route service and related types
 * for easy importing throughout the application.
 */

// Main service class
export { default as Route } from './Route';

// Types and interfaces
export type {
   HTTPMethod,
   BodySchema,
   SessionUser,
   AuthenticatedRequest,
   RouteSetup,
   RouteError,
   BodyValidationMiddleware,
   AuthVerifyMiddleware
} from './Route.types';
