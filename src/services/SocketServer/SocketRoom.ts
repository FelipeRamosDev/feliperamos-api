/**
 * SocketRoom Class
 * 
 * Manages socket.io rooms with additional functionality like member management,
 * permissions, and room-specific operations.
 */

import { RoomConfig } from './SocketServer.types';
import SocketClient from './SocketClient';

/**
 * @class SocketRoom
 * @description Represents a socket.io room with enhanced functionality
 */
export class SocketRoom {
   private _config: RoomConfig;
   private _clients: Map<string, SocketClient>;
   private _createdAt: Date;
   private _lastActivity: Date;
   private _messageCount: number;
   private _isActive: boolean;

   constructor(config: RoomConfig) {
      this._config = { ...config };
      this._clients = new Map();
      this._createdAt = new Date();
      this._lastActivity = new Date();
      this._messageCount = 0;
      this._isActive = true;

      // Validate configuration
      this.validateConfig();
   }

   /**
    * Get room ID
    */
   get id(): string {
      return this._config.id;
   }

   /**
    * Get room name
    */
   get name(): string {
      return this._config.name || this._config.id;
   }

   /**
    * Get room namespace
    */
   get namespace(): string {
      return this._config.namespace || '/';
   }

   /**
    * Get room configuration
    */
   get config(): RoomConfig {
      return { ...this._config };
   }

   /**
    * Get connected clients count
    */
   get clientCount(): number {
      return this._clients.size;
   }

   /**
    * Get maximum clients allowed
    */
   get maxClients(): number {
      return this._config.maxClients || Infinity;
   }

   /**
    * Check if room is private
    */
   get isPrivate(): boolean {
      return this._config.isPrivate || false;
   }

   /**
    * Check if room is full
    */
   get isFull(): boolean {
      return this.clientCount >= this.maxClients;
   }

   /**
    * Check if room is active
    */
   get isActive(): boolean {
      return this._isActive && this._clients.size > 0;
   }

   /**
    * Get room creation time
    */
   get createdAt(): Date {
      return new Date(this._createdAt);
   }

   /**
    * Get last activity time
    */
   get lastActivity(): Date {
      return new Date(this._lastActivity);
   }

   /**
    * Get message count
    */
   get messageCount(): number {
      return this._messageCount;
   }

   /**
    * Get all connected clients
    */
   get clients(): SocketClient[] {
      return Array.from(this._clients.values());
   }

   /**
    * Get client IDs
    */
   get clientIds(): string[] {
      return Array.from(this._clients.keys());
   }

   /**
    * Add client to room
    */
   async addClient(client: SocketClient, password?: string): Promise<boolean> {
      try {
         // Check if room is full
         if (this.isFull) {
            throw new Error('Room is full');
         }

         // Check password if room is private
         if (this.isPrivate && this._config.password && password !== this._config.password) {
            throw new Error('Invalid password');
         }

         // Check if client is already in room
         if (this._clients.has(client.id)) {
            return true; // Already in room
         }

         // Join the socket.io room
         await client.joinRoom(this.id);

         // Add client to our tracking
         this._clients.set(client.id, client);
         this.updateLastActivity();

         // Call join callback if defined
         if (this._config.onJoin) {
            this._config.onJoin(this, client.info);
         } else {
            console.log(`Client ${client.id} joined room ${this.id}`);
         }

         return true;
      } catch (error) {
         console.error(`Error adding client ${client.id} to room ${this.id}:`, error);
         return false;
      }
   }

   /**
    * Remove client from room
    */
   async removeClient(clientId: string): Promise<boolean> {
      try {
         const client = this._clients.get(clientId);
         if (!client) {
            return false; // Client not in room
         }

         // Leave the socket.io room
         await client.leaveRoom(this.id);

         // Remove client from our tracking
         this._clients.delete(clientId);
         this.updateLastActivity();

         // Call leave callback if defined
         if (this._config.onLeave) {
            this._config.onLeave(this, client.info);
         } else {
            console.log(`Client ${clientId} left room ${this.id}`);
         }

         // Check if room should be closed
         if (this._clients.size === 0) {
            this.close();
         }

         return true;
      } catch (error) {
         console.error(`Error removing client ${clientId} from room ${this.id}:`, error);
         return false;
      }
   }

   /**
    * Check if client is in room
    */
   hasClient(clientId: string): boolean {
      return this._clients.has(clientId);
   }

   /**
    * Get specific client
    */
   getClient(clientId: string): SocketClient | undefined {
      return this._clients.get(clientId);
   }

   /**
    * Broadcast message to all clients in room
    */
   broadcast(event: string, data?: any, excludeClientId?: string): void {
      this._clients.forEach((client, clientId) => {
         if (clientId !== excludeClientId && client.isActive) {
            client.emit(event, data);
         }
      });

      this._messageCount++;
      this.updateLastActivity();

      // Call message callback if defined
      if (this._config.onMessage && excludeClientId) {
         const senderClient = this._clients.get(excludeClientId);
         if (senderClient) {
            this._config.onMessage(senderClient.info, { event, data });
         }
      }
   }

   /**
    * Send message to specific client in room
    */
   sendToClient(clientId: string, event: string, data?: any): boolean {
      const client = this._clients.get(clientId);
      if (client && client.isActive) {
         client.emit(event, data);
         this._messageCount++;
         this.updateLastActivity();
         return true;
      }
      return false;
   }

   /**
    * Send message to multiple clients in room
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
    * Get room statistics
    */
   getStats(): {
      id: string;
      name: string;
      namespace: string;
      clientCount: number;
      maxClients: number;
      messageCount: number;
      createdAt: Date;
      lastActivity: Date;
      isActive: boolean;
      isFull: boolean;
      isPrivate: boolean;
   } {
      return {
         id: this.id,
         name: this.name,
         namespace: this.namespace,
         clientCount: this.clientCount,
         maxClients: this.maxClients,
         messageCount: this.messageCount,
         createdAt: this.createdAt,
         lastActivity: this.lastActivity,
         isActive: this.isActive,
         isFull: this.isFull,
         isPrivate: this.isPrivate
      };
   }

   /**
    * Update room configuration
    */
   updateConfig(newConfig: Partial<RoomConfig>): void {
      this._config = { ...this._config, ...newConfig };
      this.validateConfig();
      this.updateLastActivity();
   }

   /**
    * Set room metadata
    */
   setMetadata(key: string, value: any): void {
      if (!this._config.metadata) {
         this._config.metadata = {};
      }
      this._config.metadata[key] = value;
      this.updateLastActivity();
   }

   /**
    * Get room metadata
    */
   getMetadata(key: string): any {
      return this._config.metadata?.[key];
   }

   /**
    * Close room and disconnect all clients
    */
   close(): void {
      this._isActive = false;
      
      // Remove all clients
      const clientIds = Array.from(this._clients.keys());
      clientIds.forEach(clientId => {
         this.removeClient(clientId);
      });

      console.log(`Room ${this.id} closed`);
   }

   /**
    * Get room age in milliseconds
    */
   getAge(): number {
      return Date.now() - this._createdAt.getTime();
   }

   /**
    * Get idle time in milliseconds
    */
   getIdleTime(): number {
      return Date.now() - this._lastActivity.getTime();
   }

   /**
    * Check if room is idle for specified duration
    */
   isIdleFor(milliseconds: number): boolean {
      return this.getIdleTime() > milliseconds;
   }

   /**
    * Update last activity timestamp
    */
   private updateLastActivity(): void {
      this._lastActivity = new Date();
   }

   /**
    * Validate room configuration
    */
   private validateConfig(): void {
      if (!this._config.id || typeof this._config.id !== 'string') {
         throw new Error('Room ID is required and must be a string');
      }

      if (this._config.maxClients !== undefined && this._config.maxClients < 1) {
         throw new Error('Max clients must be at least 1');
      }

      if (this._config.isPrivate && !this._config.password) {
         console.warn(`Private room ${this._config.id} has no password set`);
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
      isActive: boolean;
   }> {
      return this.clients.map(client => ({
         id: client.id,
         userId: client.info.userId,
         username: client.info.username,
         connectedAt: client.info.connectedAt,
         lastActivity: client.info.lastActivity,
         isActive: client.isActive
      }));
   }

   /**
    * Kick client from room
    */
   async kickClient(clientId: string, reason?: string): Promise<boolean> {
      const client = this._clients.get(clientId);
      if (client) {
         if (reason) {
            client.emit('kicked', { reason, roomId: this.id });
         }
         return await this.removeClient(clientId);
      }
      return false;
   }

   /**
    * Ban client from room (future implementation could persist this)
    */
   async banClient(clientId: string, reason?: string): Promise<boolean> {
      // For now, just kick the client
      // Future implementation could add banned clients list
      return await this.kickClient(clientId, reason);
   }
}

export default SocketRoom;
