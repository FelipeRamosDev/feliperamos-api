/**
 * SocketServer Types and Interfaces
 * 
 * This file contains all TypeScript interfaces and types used in the SocketServer service.
 */

import { Server as IOServer, Socket } from 'socket.io';
import { MicroserviceSetup } from '../Microservice/Microservice.types';
import ServerAPI from '../ServerAPI/ServerAPI';

/**
 * Callback function types
 */
export type SocketCallback = (...args: any[]) => void;
export type RoomCallback = (roomId: string, ...args: any[]) => void;
export type ClientCallback = (clientId: string, ...args: any[]) => void;

/**
 * Socket Server configuration interface
 */
export interface SocketServerSetup extends MicroserviceSetup {
   serverAPI: ServerAPI;
   corsOrigin?: string[];
   allowEIO3?: boolean;
   transports?: string[];
   pingTimeout?: number;
   pingInterval?: number;
   upgradeTimeout?: number;
   maxHttpBufferSize?: number;
   allowRequest?: (req: any, callback: (err: string | null | undefined, success: boolean) => void) => void;
}

/**
 * Namespace configuration interface
 */
export interface NamespaceConfig {
   name: string;
   path: string;
   middlewares?: NamespaceMiddleware[];
   events?: NamespaceEvent[];
   authentication?: boolean;
   connectionHandler?: (socket: Socket) => void;
   disconnectionHandler?: (socket: Socket, reason: string) => void;
}

/**
 * Namespace middleware interface
 */
export interface NamespaceMiddleware {
   name: string;
   handler: (socket: Socket, next: (err?: Error) => void) => void;
}

/**
 * Namespace event interface
 */
export interface NamespaceEvent {
   name: string;
   handler: (socket: Socket, ...args: any[]) => void;
}

/**
 * Room configuration interface
 */
export interface RoomConfig {
   id: string;
   name?: string;
   namespace?: string;
   maxClients?: number;
   isPrivate?: boolean;
   password?: string;
   metadata?: Record<string, any>;
   onJoin?: (client: ClientInfo) => void;
   onLeave?: (client: ClientInfo) => void;
   onMessage?: (client: ClientInfo, message: any) => void;
}

/**
 * Client information interface
 */
export interface ClientInfo {
   id: string;
   socket: Socket;
   userId?: string;
   username?: string;
   rooms: Set<string>;
   namespace: string;
   connectedAt: Date;
   lastActivity: Date;
   metadata?: Record<string, any>;
}

/**
 * Message interface
 */
export interface SocketMessage {
   id: string;
   from: string;
   to?: string;
   room?: string;
   namespace: string;
   event: string;
   data: any;
   timestamp: Date;
   type: 'direct' | 'room' | 'broadcast';
}

/**
 * Connection statistics interface
 */
export interface ConnectionStats {
   totalConnections: number;
   activeConnections: number;
   totalRooms: number;
   activeRooms: number;
   totalNamespaces: number;
   messagesPerSecond: number;
   uptime: number;
}

/**
 * Socket server events
 */
export interface SocketServerEvents {
   connection: (socket: Socket) => void;
   disconnect: (socket: Socket, reason: string) => void;
   error: (error: Error) => void;
   'client-connected': (client: ClientInfo) => void;
   'client-disconnected': (client: ClientInfo, reason: string) => void;
   'room-created': (room: RoomConfig) => void;
   'room-deleted': (roomId: string) => void;
   'message-sent': (message: SocketMessage) => void;
}

/**
 * Extended Socket interface with additional properties
 */
export interface ExtendedSocket extends Socket {
   clientInfo?: ClientInfo;
   isAuthenticated?: boolean;
   userId?: string;
   username?: string;
   joinedRooms?: Set<string>;
}
