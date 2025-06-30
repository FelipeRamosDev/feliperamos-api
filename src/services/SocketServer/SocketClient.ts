/**
 * SocketClient Class
 * 
 * Manages individual socket client connections, their state, and operations.
 */

import { Socket } from 'socket.io';
import { ClientInfo, SocketMessage } from './SocketServer.types';

/**
 * @class SocketClient
 * @description Represents a connected socket client with additional functionality
 */
export class SocketClient {
   private _socket: Socket;
   private _info: ClientInfo;
   private _isActive: boolean;
   private _heartbeatInterval?: NodeJS.Timeout;
   private _lastHeartbeat: Date;

   constructor(socket: Socket, namespace: string = '/') {
      this._socket = socket;
      this._isActive = true;
      this._lastHeartbeat = new Date();

      this._info = {
         id: socket.id,
         socket: socket,
         rooms: new Set<string>(),
         namespace: namespace,
         connectedAt: new Date(),
         lastActivity: new Date(),
         metadata: {}
      };

      this.setupHeartbeat();
      this.setupEventListeners();
   }

   /**
    * Get client information
    */
   get info(): ClientInfo {
      return { ...this._info };
   }

   /**
    * Get socket instance
    */
   get socket(): Socket {
      return this._socket;
   }

   /**
    * Get client ID
    */
   get id(): string {
      return this._info.id;
   }

   /**
    * Get client namespace
    */
   get namespace(): string {
      return this._info.namespace;
   }

   /**
    * Check if client is active
    */
   get isActive(): boolean {
      return this._isActive && this._socket.connected;
   }

   /**
    * Get client rooms
    */
   get rooms(): Set<string> {
      return new Set(this._info.rooms);
   }

   /**
    * Set user information
    */
   setUser(userId: string, username?: string): void {
      this._info.userId = userId;
      this._info.username = username;
      this.updateLastActivity();
   }

   /**
    * Set client metadata
    */
   setMetadata(key: string, value: any): void {
      if (!this._info.metadata) {
         this._info.metadata = {};
      }
      this._info.metadata[key] = value;
      this.updateLastActivity();
   }

   /**
    * Get client metadata
    */
   getMetadata(key: string): any {
      return this._info.metadata?.[key];
   }

   /**
    * Update last activity timestamp
    */
   updateLastActivity(): void {
      this._info.lastActivity = new Date();
      this._lastHeartbeat = new Date();
   }

   /**
    * Join a room
    */
   async joinRoom(roomId: string): Promise<boolean> {
      try {
         await this._socket.join(roomId);
         this._info.rooms.add(roomId);
         this.updateLastActivity();
         return true;
      } catch (error) {
         console.error(`Error joining room ${roomId}:`, error);
         return false;
      }
   }

   /**
    * Leave a room
    */
   async leaveRoom(roomId: string): Promise<boolean> {
      try {
         await this._socket.leave(roomId);
         this._info.rooms.delete(roomId);
         this.updateLastActivity();
         return true;
      } catch (error) {
         console.error(`Error leaving room ${roomId}:`, error);
         return false;
      }
   }

   /**
    * Leave all rooms
    */
   async leaveAllRooms(): Promise<void> {
      const rooms = Array.from(this._info.rooms);
      for (const roomId of rooms) {
         await this.leaveRoom(roomId);
      }
   }

   /**
    * Send message to client
    */
   emit(event: string, data?: any): void {
      if (this.isActive) {
         this._socket.emit(event, data);
         this.updateLastActivity();
      }
   }

   /**
    * Send message and wait for acknowledgment
    */
   async emitWithAck(event: string, data?: any, timeout: number = 5000): Promise<any> {
      if (!this.isActive) {
         throw new Error('Client is not active');
      }

      return new Promise((resolve, reject) => {
         const timer = setTimeout(() => {
            reject(new Error('Acknowledgment timeout'));
         }, timeout);

         this._socket.emit(event, data, (response: any) => {
            clearTimeout(timer);
            this.updateLastActivity();
            resolve(response);
         });
      });
   }

   /**
    * Add event listener
    */
   on(event: string, callback: (...args: any[]) => void): void {
      this._socket.on(event, (...args: any[]) => {
         this.updateLastActivity();
         callback(...args);
      });
   }

   /**
    * Remove event listener
    */
   off(event: string, callback?: (...args: any[]) => void): void {
      if (callback) {
         this._socket.off(event, callback);
      } else {
         this._socket.removeAllListeners(event);
      }
   }

   /**
    * Disconnect client
    */
   disconnect(reason?: string): void {
      this._isActive = false;
      this.clearHeartbeat();
      this._socket.disconnect(true);
      
      if (reason) {
         console.log(`Client ${this.id} disconnected: ${reason}`);
      }
   }

   /**
    * Check if client is in a specific room
    */
   isInRoom(roomId: string): boolean {
      return this._info.rooms.has(roomId);
   }

   /**
    * Get connection duration in milliseconds
    */
   getConnectionDuration(): number {
      return Date.now() - this._info.connectedAt.getTime();
   }

   /**
    * Get idle time in milliseconds
    */
   getIdleTime(): number {
      return Date.now() - this._info.lastActivity.getTime();
   }

   /**
    * Setup heartbeat mechanism
    */
   private setupHeartbeat(): void {
      this._heartbeatInterval = setInterval(() => {
         if (this.isActive) {
            this._socket.emit('ping');
         } else {
            this.clearHeartbeat();
         }
      }, 30000); // Ping every 30 seconds
   }

   /**
    * Clear heartbeat interval
    */
   private clearHeartbeat(): void {
      if (this._heartbeatInterval) {
         clearInterval(this._heartbeatInterval);
         this._heartbeatInterval = undefined;
      }
   }

   /**
    * Setup default event listeners
    */
   private setupEventListeners(): void {
      this._socket.on('pong', () => {
         this.updateLastActivity();
      });

      this._socket.on('disconnect', (reason: string) => {
         this._isActive = false;
         this.clearHeartbeat();
         console.log(`Client ${this.id} disconnected: ${reason}`);
      });

      this._socket.on('error', (error: Error) => {
         console.error(`Client ${this.id} error:`, error);
      });
   }

   /**
    * Cleanup resources
    */
   cleanup(): void {
      this._isActive = false;
      this.clearHeartbeat();
      this._socket.removeAllListeners();
   }

   /**
    * Get client status summary
    */
   getStatus(): {
      id: string;
      isActive: boolean;
      connectedAt: Date;
      lastActivity: Date;
      roomCount: number;
      connectionDuration: number;
      idleTime: number;
   } {
      return {
         id: this.id,
         isActive: this.isActive,
         connectedAt: this._info.connectedAt,
         lastActivity: this._info.lastActivity,
         roomCount: this._info.rooms.size,
         connectionDuration: this.getConnectionDuration(),
         idleTime: this.getIdleTime()
      };
   }
}

export default SocketClient;
