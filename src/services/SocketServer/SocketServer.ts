/**
 * SocketServer Class
 * 
 * Main Socket.IO server implementation that integrates with ServerAPI
 * and provides comprehensive real-time communication functionality.
 */

import { Server as IOServer, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { createServer as createHTTPSServer, Server as HTTPSServer } from 'https';
import fs from 'fs';
import Microservice from '../Microservice/Microservice';
import ServerAPI from '../ServerAPI/ServerAPI';
import {
   SocketServerSetup,
   NamespaceConfig,
   RoomConfig,
   ConnectionStats,
   SocketMessage,
   ExtendedSocket
} from './SocketServer.types';
import SocketNamespace from './SocketNamespace';
import SocketRoom from './SocketRoom';
import SocketClient from './SocketClient';

/**
 * @class SocketServer
 * @description Main Socket.IO server service that manages namespaces, rooms, and clients
 */
export class SocketServer extends Microservice {
   private _serverAPI: ServerAPI;
   private _io!: IOServer;
   private _httpServer!: HTTPServer | HTTPSServer;
   private _namespaces: Map<string, SocketNamespace>;
   private _globalRooms: Map<string, SocketRoom>;
   private _clients: Map<string, SocketClient>;
   private _config: SocketServerSetup;
   private _isStarted: boolean;
   private _startTime: Date;
   private _stats: ConnectionStats;
   private _statsIntervalId?: NodeJS.Timeout;

   constructor(setup: SocketServerSetup) {
      super(setup);
      
      this._config = setup;
      this._serverAPI = setup.serverAPI;
      this._namespaces = new Map();
      this._globalRooms = new Map();
      this._clients = new Map();
      this._isStarted = false;
      this._startTime = new Date();
      this._stats = {
         totalConnections: 0,
         activeConnections: 0,
         totalRooms: 0,
         activeRooms: 0,
         totalNamespaces: 0,
         messagesPerSecond: 0,
         uptime: 0
      };

      this.initialize();
   }

   /**
    * Get Socket.IO server instance
    */
   get io(): IOServer {
      return this._io;
   }

   /**
    * Get HTTP server instance
    */
   get httpServer(): HTTPServer | HTTPSServer {
      return this._httpServer;
   }

   /**
    * Get server statistics
    */
   get stats(): ConnectionStats {
      return {
         ...this._stats,
         uptime: Date.now() - this._startTime.getTime()
      };
   }

   /**
    * Check if server is started
    */
   get isStarted(): boolean {
      return this._isStarted;
   }

   /**
    * Get all namespaces
    */
   get namespaces(): SocketNamespace[] {
      return Array.from(this._namespaces.values());
   }

   /**
    * Get all global rooms
    */
   get globalRooms(): SocketRoom[] {
      return Array.from(this._globalRooms.values());
   }

   /**
    * Get all connected clients
    */
   get clients(): SocketClient[] {
      return Array.from(this._clients.values());
   }

   /**
    * Initialize the Socket.IO server
    */
   private initialize(): void {
      try {
         // Create HTTP server using ServerAPI's Express app
         if (this._serverAPI.useSSL && this._serverAPI.sslConfig) {
            const sslOptions = {
               key: fs.readFileSync(this._serverAPI.sslConfig.keySSLPath),
               cert: fs.readFileSync(this._serverAPI.sslConfig.certSSLPath)
            };
            this._httpServer = createHTTPSServer(sslOptions, this._serverAPI.app);
         } else {
            this._httpServer = createServer(this._serverAPI.app);
         }

         // Create Socket.IO server
         this._io = new IOServer(this._httpServer, {
            cors: {
               origin: this._config.corsOrigin || this._serverAPI.corsOrigin,
               credentials: true
            },
            allowEIO3: this._config.allowEIO3 || false,
            transports: (this._config.transports as any) || ['websocket', 'polling'],
            pingTimeout: this._config.pingTimeout || 20000,
            pingInterval: this._config.pingInterval || 25000,
            upgradeTimeout: this._config.upgradeTimeout || 10000,
            maxHttpBufferSize: this._config.maxHttpBufferSize || 1e6,
            allowRequest: this._config.allowRequest
         });

         this.setupDefaultNamespace();
         this.setupEventHandlers();
         this.startStatisticsTracking();
      } catch (error) {
         console.error('Error initializing SocketServer:', error);
         throw error;
      }
   }

   /**
    * Start the Socket.IO server
    */
   start(port?: number): Promise<void> {
      return new Promise((resolve, reject) => {
         try {
            const serverPort = port || this._serverAPI.PORT;
            
            this._httpServer.listen(serverPort, () => {
               this._isStarted = true;
               this._startTime = new Date();
               console.log(`SocketServer started on port ${serverPort}`);
               resolve();
            });

            this._httpServer.on('error', (error) => {
               console.error('SocketServer HTTP server error:', error);
               reject(error);
            });
         } catch (error) {
            reject(error);
         }
      });
   }

   /**
    * Stop the Socket.IO server
    */
   stop(): Promise<void> {
      return new Promise((resolve) => {
         if (!this._isStarted) {
            resolve();
            return;
         }

         // Close all namespaces
         this._namespaces.forEach(namespace => {
            namespace.close();
         });

         // Close all global rooms
         this._globalRooms.forEach(room => {
            room.close();
         });

         // Disconnect all clients
         this._clients.forEach(client => {
            client.disconnect('Server shutdown');
         });

         // Clear statistics interval
         if (this._statsIntervalId) {
            clearInterval(this._statsIntervalId);
         }

         // Close Socket.IO server
         this._io.close(() => {
            this._httpServer.close(() => {
               this._isStarted = false;
               console.log('SocketServer stopped');
               resolve();
            });
         });
      });
   }

   /**
    * Create a new namespace
    */
   createNamespace(config: NamespaceConfig): SocketNamespace {
      if (this._namespaces.has(config.path)) {
         throw new Error(`Namespace ${config.path} already exists`);
      }

      const namespace = this._io.of(config.path);
      const socketNamespace = new SocketNamespace(namespace, config);
      
      this._namespaces.set(config.path, socketNamespace);
      this._stats.totalNamespaces++;

      console.log(`Namespace ${config.name} created at path ${config.path}`);
      return socketNamespace;
   }

   /**
    * Get namespace by path
    */
   getNamespace(path: string): SocketNamespace | undefined {
      return this._namespaces.get(path);
   }

   /**
    * Delete namespace
    */
   deleteNamespace(path: string): boolean {
      const namespace = this._namespaces.get(path);
      if (namespace) {
         namespace.close();
         this._namespaces.delete(path);
         console.log(`Namespace ${path} deleted`);
         return true;
      }
      return false;
   }

   /**
    * Create a global room (available across all namespaces)
    */
   createRoom(config: RoomConfig): SocketRoom {
      if (this._globalRooms.has(config.id)) {
         throw new Error(`Global room ${config.id} already exists`);
      }

      const room = new SocketRoom(config);
      this._globalRooms.set(config.id, room);
      this._stats.totalRooms++;

      console.log(`Global room ${config.id} created`);
      return room;
   }

   /**
    * Get global room
    */
   getRoom(roomId: string): SocketRoom | undefined {
      return this._globalRooms.get(roomId);
   }

   /**
    * Delete global room
    */
   deleteRoom(roomId: string): boolean {
      const room = this._globalRooms.get(roomId);
      if (room) {
         room.close();
         this._globalRooms.delete(roomId);
         console.log(`Global room ${roomId} deleted`);
         return true;
      }
      return false;
   }

   /**
    * Join client to global room
    */
   async joinRoom(clientId: string, roomId: string, password?: string): Promise<boolean> {
      const client = this._clients.get(clientId);
      const room = this._globalRooms.get(roomId);

      if (!client || !room) {
         return false;
      }

      return await room.addClient(client, password);
   }

   /**
    * Remove client from global room
    */
   async leaveRoom(clientId: string, roomId: string): Promise<boolean> {
      const room = this._globalRooms.get(roomId);
      if (room) {
         return await room.removeClient(clientId);
      }
      return false;
   }

   /**
    * Send message to specific client
    */
   sendToClient(clientId: string, event: string, data?: any): boolean {
      const client = this._clients.get(clientId);
      if (client && client.isActive) {
         client.emit(event, data);
         return true;
      }
      return false;
   }

   /**
    * Send message to global room
    */
   sendToRoom(roomId: string, event: string, data?: any, excludeClientId?: string): boolean {
      const room = this._globalRooms.get(roomId);
      if (room) {
         room.broadcast(event, data, excludeClientId);
         return true;
      }
      return false;
   }

   /**
    * Broadcast message to all connected clients
    */
   broadcast(event: string, data?: any, excludeClientId?: string): void {
      if (excludeClientId) {
         this._io.except(excludeClientId).emit(event, data);
      } else {
         this._io.emit(event, data);
      }
   }

   /**
    * Send message to multiple clients
    */
   sendToClients(clientIds: string[], event: string, data?: any): number {
      let sentCount = 0;
      clientIds.forEach(clientId => {
         if (this.sendToClient(clientId, event, data)) {
            sentCount++;
         }
      });
      return sentCount;
   }

   /**
    * Get client by ID
    */
   getClient(clientId: string): SocketClient | undefined {
      return this._clients.get(clientId);
   }

   /**
    * Disconnect client
    */
   disconnectClient(clientId: string, reason?: string): boolean {
      const client = this._clients.get(clientId);
      if (client) {
         client.disconnect(reason);
         return true;
      }
      return false;
   }

   /**
    * Get server statistics
    */
   getStats(): ConnectionStats {
      return this.stats;
   }

   /**
    * Get detailed server information
    */
   getServerInfo(): {
      isStarted: boolean;
      startTime: Date;
      uptime: number;
      stats: ConnectionStats;
      namespaces: Array<{
         name: string;
         path: string;
         clientCount: number;
         roomCount: number;
      }>;
      globalRooms: Array<{
         id: string;
         name: string;
         clientCount: number;
         isActive: boolean;
      }>;
   } {
      return {
         isStarted: this._isStarted,
         startTime: this._startTime,
         uptime: this.stats.uptime,
         stats: this.stats,
         namespaces: this.namespaces.map(ns => ({
            name: ns.name,
            path: ns.path,
            clientCount: ns.clientCount,
            roomCount: ns.roomCount
         })),
         globalRooms: this.globalRooms.map(room => ({
            id: room.id,
            name: room.name,
            clientCount: room.clientCount,
            isActive: room.isActive
         }))
      };
   }

   /**
    * Setup default namespace ("/")
    */
   private setupDefaultNamespace(): void {
      const defaultConfig: NamespaceConfig = {
         name: 'default',
         path: '/',
         middlewares: [],
         events: [],
         authentication: false
      };

      this.createNamespace(defaultConfig);
   }

   /**
    * Setup global event handlers
    */
   private setupEventHandlers(): void {
      this._io.on('connection', (socket: Socket) => {
         this.handleGlobalConnection(socket);
      });

      this._io.engine.on('connection_error', (err: any) => {
         console.error('Socket.IO connection error:', err);
      });
   }

   /**
    * Handle global connection (applies to all namespaces)
    */
   private handleGlobalConnection(socket: Socket): void {
      const client = new SocketClient(socket);
      this._clients.set(socket.id, client);
      this._stats.totalConnections++;
      this._stats.activeConnections++;

      console.log(`Global client ${socket.id} connected`);

      // Setup global event handlers
      socket.on('disconnect', (reason: string) => {
         this.handleGlobalDisconnection(socket, reason);
      });

      socket.on('error', (error: Error) => {
         console.error(`Global client ${socket.id} error:`, error);
      });

      // Global room management
      socket.on('join-global-room', async (data: { roomId: string; password?: string }) => {
         await this.joinRoom(socket.id, data.roomId, data.password);
      });

      socket.on('leave-global-room', async (data: { roomId: string }) => {
         await this.leaveRoom(socket.id, data.roomId);
      });

      socket.on('global-room-message', (data: { roomId: string; event: string; message: any }) => {
         this.sendToRoom(data.roomId, data.event, data.message, socket.id);
      });
   }

   /**
    * Handle global disconnection
    */
   private handleGlobalDisconnection(socket: Socket, reason: string): void {
      const client = this._clients.get(socket.id);
      if (client) {
         client.cleanup();
         this._clients.delete(socket.id);
         this._stats.activeConnections--;

         console.log(`Global client ${socket.id} disconnected: ${reason}`);
      }
   }

   /**
    * Start statistics tracking
    */
   private startStatisticsTracking(): void {
      this._statsIntervalId = setInterval(() => {
         this.updateStatistics();
      }, 5000); // Update every 5 seconds
   }

   /**
    * Update server statistics
    */
   private updateStatistics(): void {
      this._stats.activeConnections = this._clients.size;
      this._stats.activeRooms = this._globalRooms.size;
      this._stats.totalNamespaces = this._namespaces.size;
      
      // Add namespace rooms to total
      this._namespaces.forEach(namespace => {
         this._stats.activeRooms += namespace.roomCount;
      });
   }

   /**
    * Close a client connection
    */
   closeConnection(clientId: string, reason?: string): boolean {
      return this.disconnectClient(clientId, reason);
   }

   /**
    * Close a room
    */
   closeRoom(roomId: string): boolean {
      return this.deleteRoom(roomId);
   }
}

export default SocketServer;
