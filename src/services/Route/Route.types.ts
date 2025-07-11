/**
 * Route Types and Interfaces
 * 
 * This file contains all TypeScript interfaces and types used in the Route service.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * HTTP methods supported by the Route service
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

/**
 * Body schema for request validation
 */
export interface BodySchema {
   [key: string]: any;
}

/**
 * User object structure for session-based authentication
 */
export interface SessionUser {
   rules?: string[];
   [key: string]: any;
}

/**
 * Extended Request interface with session information
 */
export interface AuthenticatedRequest extends Request {
   session: Request['session'] & {
      user?: SessionUser;
   };
}

/**
 * Configuration interface for Route/Endpoint setup
 */
export interface RouteSetup {
   method?: HTTPMethod;
   routePath: string;
   rules?: string[];
   controller: RequestHandler;
   bodySchema?: BodySchema;
   useAuth?: boolean;
   authRule?: string;
   middlewares?: RequestHandler[];
   noValidateBody?: boolean;
}

/**
 * Error object structure for route validation errors
 */
export interface RouteError {
   name: string;
   message: string;
}

/**
 * Type for middleware function with body schema parameter
 */
export type BodyValidationMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction,
   bodySchema: BodySchema
) => void;

/**
 * Type for authentication verification middleware
 */
export type AuthVerifyMiddleware = RequestHandler;
