/**
 * SocketNamespace Class
 * 
 * Manages socket.io namespaces similar to HTTP routes with middleware,
 * event handlers, and namespace-specific functionality.
 */

import { Namespace, Socket } from 'socket.io';
import { 
   NamespaceConfig, 
   NamespaceMiddleware, 
   NamespaceEvent,
   ExtendedSocket 
} from './SocketServer.types';
import SocketClient from './SocketClient';
import SocketRoom from './SocketRoom';

/**
 * @class SocketNamespace
 * @description Represents a socket.io namespace with route-like functionality
 */
export class SocketNamespace {
   private _config: NamespaceConfig;
   private _namespace: Namespace;
   private _clients: Map<string, SocketClient>;
   private _rooms: Map<string, SocketRoom>;
   private _middlewares: NamespaceMiddleware[];
   private _events: Map<string, NamespaceEvent>;
   private _isActive: boolean;
   private _createdAt: Date;
   private _stats: {
      totalConnections: number;
      currentConnections: number;
      totalMessages: number;
      totalRooms: number;
   };

   constructor(namespace: Namespace, config: NamespaceConfig) {
      this._namespace = namespace;
      this._config = { ...config };
      this._clients = new Map();
      this._rooms = new Map();
      this._middlewares = config.middlewares || [];
      this._events = new Map();
      this._isActive = true;
      this._createdAt = new Date();
      this._stats = {
         totalConnections: 0,
         currentConnections: 0,
         totalMessages: 0,
         totalRooms: 0
      };

      this.setupNamespace();
      this.registerEvents();
   }

   /**
    * Get namespace name
    */
   get name(): string {
      return this._config.name;
   }

   /**
    * Get namespace path
    */
   get path(): string {
      return this._config.path;
   }

   /**
    * Get namespace configuration
    */
   get config(): NamespaceConfig {
      return { ...this._config };
   }

   /**
    * Get connected clients count
    */
   get clientCount(): number {
      return this._clients.size;
   }

   /**
    * Get rooms count
    */
   get roomCount(): number {
      return this._rooms.size;
   }

   /**
    * Get namespace statistics
    */
   get stats(): typeof this._stats {
      return { ...this._stats };
   }

   /**
    * Check if namespace is active
    */
   get isActive(): boolean {
      return this._isActive;
   }

   /**
    * Get all connected clients
    */
   get clients(): SocketClient[] {
      return Array.from(this._clients.values());
   }

   /**
    * Get all rooms
    */
   get rooms(): SocketRoom[] {
      return Array.from(this._rooms.values());
   }

   /**
    * Add middleware to namespace
    */
   use(middleware: NamespaceMiddleware): void {
      this._middlewares.push(middleware);
      this._namespace.use((socket: Socket, next) => {
         middleware.handler(socket, next);
      });
   }

   /**
    * Register event handler
    */
   on(eventName: string, handler: (socket: Socket, ...args: any[]) => void): void {
      const event: NamespaceEvent = {
         name: eventName,
         handler
      };

      this._events.set(eventName, event);
   }

   /**
    * Remove event handler
    */
   off(eventName: string): void {
      this._events.delete(eventName);
   }

   /**
    * Get specific client
    */
   getClient(clientId: string): SocketClient | undefined {
      return this._clients.get(clientId);
   }

   /**
    * Get specific room
    */
   getRoom(roomId: string): SocketRoom | undefined {
      return this._rooms.get(roomId);
   }

   /**
    * Create a new room
    */
   createRoom(roomConfig: { id: string; name?: string; maxClients?: number; isPrivate?: boolean; password?: string }): SocketRoom {
      if (this._rooms.has(roomConfig.id)) {
         throw new Error(`Room ${roomConfig.id} already exists in namespace ${this.name}`);
      }

      const room = new SocketRoom({
         ...roomConfig,
         namespace: this.path
      });

      this._rooms.set(roomConfig.id, room);
      this._stats.totalRooms++;

      console.log(`Room ${roomConfig.id} created in namespace ${this.name}`);
      return room;
   }

   /**
    * Delete a room
    */
   deleteRoom(roomId: string): boolean {
      const room = this._rooms.get(roomId);
      if (room) {
         room.close();
         this._rooms.delete(roomId);
         console.log(`Room ${roomId} deleted from namespace ${this.name}`);
         return true;
      }
      return false;
   }

   /**
    * Join client to room
    */
   async joinRoom(clientId: string, roomId: string, password?: string): Promise<boolean> {
      const client = this._clients.get(clientId);
      const room = this._rooms.get(roomId);

      if (!client || !room) {
         return false;
      }

      return await room.addClient(client, password);
   }

   /**
    * Remove client from room
    */
   async leaveRoom(clientId: string, roomId: string): Promise<boolean> {
      const room = this._rooms.get(roomId);
      if (room) {
         return await room.removeClient(clientId);
      }
      return false;
   }

   /**
    * Broadcast message to all clients in namespace
    */
   broadcast(event: string, data?: any, excludeClientId?: string): void {
      this._clients.forEach((client, clientId) => {
         if (clientId !== excludeClientId && client.isActive) {
            client.emit(event, data);
         }
      });

      this._stats.totalMessages++;
   }

   /**
    * Send message to specific client
    */
   sendToClient(clientId: string, event: string, data?: any): boolean {
      const client = this._clients.get(clientId);
      if (client && client.isActive) {
         client.emit(event, data);
         this._stats.totalMessages++;
         return true;
      }
      return false;
   }

   /**
    * Send message to room
    */
   sendToRoom(roomId: string, event: string, data?: any, excludeClientId?: string): boolean {
      const room = this._rooms.get(roomId);
      if (room) {
         room.broadcast(event, data, excludeClientId);
         this._stats.totalMessages++;
         return true;
      }
      return false;
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
    * Get namespace statistics
    */
   getStats(): {
      name: string;
      path: string;
      clientCount: number;
      roomCount: number;
      totalConnections: number;
      totalMessages: number;
      totalRooms: number;
      isActive: boolean;
      createdAt: Date;
   } {
      return {
         name: this.name,
         path: this.path,
         clientCount: this.clientCount,
         roomCount: this.roomCount,
         totalConnections: this._stats.totalConnections,
         totalMessages: this._stats.totalMessages,
         totalRooms: this._stats.totalRooms,
         isActive: this.isActive,
         createdAt: this._createdAt
      };
   }

   /**
    * Disconnect all clients
    */
   disconnectAll(reason?: string): void {
      this._clients.forEach(client => {
         client.disconnect(reason);
      });
   }

   /**
    * Close namespace
    */
   close(): void {
      this._isActive = false;
      
      // Close all rooms
      this._rooms.forEach(room => {
         room.close();
      });
      this._rooms.clear();

      // Disconnect all clients
      this.disconnectAll('Namespace closed');
      this._clients.clear();

      console.log(`Namespace ${this.name} closed`);
   }

   /**
    * Setup namespace with middlewares and default handlers
    */
   private setupNamespace(): void {
      // Apply middlewares
      this._middlewares.forEach(middleware => {
         this._namespace.use((socket: Socket, next) => {
            middleware.handler(socket, next);
         });
      });

      // Authentication middleware if required
      if (this._config.authentication) {
         this._namespace.use((socket: ExtendedSocket, next) => {
            if (!socket.isAuthenticated) {
               next(new Error('Authentication required'));
               return;
            }
            next();
         });
      }

      // Connection handler
      this._namespace.on('connection', (socket: Socket) => {
         this.handleConnection(socket);
      });
   }

   /**
    * Register custom events
    */
   private registerEvents(): void {
      if (this._config.events) {
         this._config.events.forEach(event => {
            this._events.set(event.name, event);
         });
      }
   }

   /**
    * Handle new client connection
    */
   private handleConnection(socket: Socket): void {
      const client = new SocketClient(socket, this.path);
      this._clients.set(socket.id, client);
      this._stats.totalConnections++;
      this._stats.currentConnections++;

      console.log(`Client ${socket.id} connected to namespace ${this.name}`);

      // Call custom connection handler if defined
      if (this._config.connectionHandler) {
         this._config.connectionHandler(socket);
      }

      // Register custom events for this client
      this._events.forEach((event, eventName) => {
         socket.on(eventName, (...args: any[]) => {
            event.handler(socket, ...args);
         });
      });

      // Handle disconnection
      socket.on('disconnect', (reason: string) => {
         this.handleDisconnection(socket, reason);
      });

      // Default room management events
      socket.on('join-room', async (data: { roomId: string; password?: string }) => {
         await this.joinRoom(socket.id, data.roomId, data.password);
      });

      socket.on('leave-room', async (data: { roomId: string }) => {
         await this.leaveRoom(socket.id, data.roomId);
      });

      socket.on('room-message', (data: { roomId: string; event: string; message: any }) => {
         this.sendToRoom(data.roomId, data.event, data.message, socket.id);
      });
   }

   /**
    * Handle client disconnection
    */
   private handleDisconnection(socket: Socket, reason: string): void {
      const client = this._clients.get(socket.id);
      if (client) {
         // Remove client from all rooms
         client.leaveAllRooms();
         
         // Clean up client
         client.cleanup();
         this._clients.delete(socket.id);
         this._stats.currentConnections--;

         console.log(`Client ${socket.id} disconnected from namespace ${this.name}: ${reason}`);

         // Call custom disconnection handler if defined
         if (this._config.disconnectionHandler) {
            this._config.disconnectionHandler(socket, reason);
         }
      }
   }

   /**
    * Get detailed client information
    */
   getClientDetails(): Array<{
      id: string;
      userId?: string;
      username?: string;
      connectedAt: Date;
      lastActivity: Date;
      roomCount: number;
      isActive: boolean;
   }> {
      return this.clients.map(client => ({
         id: client.id,
         userId: client.info.userId,
         username: client.info.username,
         connectedAt: client.info.connectedAt,
         lastActivity: client.info.lastActivity,
         roomCount: client.rooms.size,
         isActive: client.isActive
      }));
   }

   /**
    * Get room details
    */
   getRoomDetails(): Array<{
      id: string;
      name: string;
      clientCount: number;
      maxClients: number;
      isPrivate: boolean;
      createdAt: Date;
      lastActivity: Date;
   }> {
      return this.rooms.map(room => ({
         id: room.id,
         name: room.name,
         clientCount: room.clientCount,
         maxClients: room.maxClients,
         isPrivate: room.isPrivate,
         createdAt: room.createdAt,
         lastActivity: room.lastActivity
      }));
   }
}

export default SocketNamespace;
