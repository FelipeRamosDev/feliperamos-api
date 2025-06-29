/**
 * ServerAPI Types and Interfaces
 * 
 * This file contains all TypeScript interfaces and types used in the ServerAPI service.
 */

import { RequestHandler } from 'express';
import { MicroserviceSetup } from '../Microservice/Microservice.types';
import type { Route } from '../Route';

/**
 * Callback function type
 */
export type Callback = () => void;

export interface SSLConfig {
   keySSLPath: string;
   certSSLPath: string;
}

/**
 * Configuration interface for ServerAPI setup
 * Extends MicroserviceSetup to inherit base microservice configuration
 */
export interface ServerAPISetup extends MicroserviceSetup {
   projectName: string;
   API_SECRET: string;
   staticPath?: string;
   sslConfig?: SSLConfig;
   FE_ORIGIN?: string;
   PORT?: number;
   jsonLimit?: string;
   onReady?: Callback;
   httpEndpoints?: Route[];
   defaultMaxListeners?: number;
   sessionCookiesMaxAge?: number;
   sessionResave?: boolean;
   sessionSaveUninitialized?: boolean;
   redisURL?: string;
   corsOrigin?: string[];
}

/**
 * Legacy endpoint configuration interface for backward compatibility
 * @deprecated Use Route class instead
 */
export interface RouteConfig {
   method: 'GET' | 'POST' | 'PUT' | 'DELETE';
   routePath: string;
   middlewares?: RequestHandler[];
   controller: RequestHandler;
}

