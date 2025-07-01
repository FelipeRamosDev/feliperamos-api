/**
 * SocketServer Usage Example
 * 
 * This file demonstrates how to use the SocketServer service
 * with ServerAPI integration and all the available features.
 */

import { SocketServer, SocketNamespace, SocketRoom, SocketClient } from './index';
import ServerAPI from '../ServerAPI/ServerAPI';
import { NamespaceConfig, RoomConfig } from './SocketServer.types';

// Example: Basic SocketServer setup
export class SocketServerExample {
   private socketServer: SocketServer;
   private serverAPI: ServerAPI;

   constructor() {
      // Initialize ServerAPI first
      this.serverAPI = new ServerAPI({
         id: 'socket-server-example',
         projectName: 'Socket Server Demo',
         API_SECRET: 'your-api-secret',
         PORT: 3000,
         corsOrigin: ['http://localhost:3000', 'http://localhost:3001']
      });

      // Initialize SocketServer with ServerAPI
      this.socketServer = new SocketServer({
         id: 'socket-server',
         serverAPI: this.serverAPI,
         corsOrigin: ['http://localhost:3000', 'http://localhost:3001'],
         pingTimeout: 20000,
         pingInterval: 25000
      });
   }

   async start(): Promise<void> {
      try {
         // Start the socket server
         await this.socketServer.start();
         
         // Setup namespaces, rooms, and event handlers
         this.setupNamespaces();
         this.setupGlobalRooms();
         this.setupEventHandlers();
         
         console.log('SocketServer example started successfully!');
      } catch (error) {
         console.error('Failed to start SocketServer:', error);
      }
   }

   private setupNamespaces(): void {
      // Create a chat namespace
      const chatNamespace = this.socketServer.createNamespace({
         name: 'Chat',
         path: '/chat',
         authentication: false,
         middlewares: [
            {
               name: 'logger',
               handler: (socket, next) => {
                  console.log(`Chat namespace: ${socket.id} attempting to connect`);
                  next();
               }
            }
         ],
         events: [
            {
               name: 'send-message',
               handler: (socket, data) => {
                  console.log(`Message from ${socket.id}:`, data);
                  // Broadcast to all clients in the namespace
                  const namespace = this.socketServer.getNamespace('/chat');
                  namespace?.broadcast('new-message', {
                     id: socket.id,
                     message: data.message,
                     timestamp: new Date()
                  }, socket.id);
               }
            }
         ],
         connectionHandler: (socket) => {
            console.log(`User connected to chat: ${socket.id}`);
            socket.emit('welcome', { message: 'Welcome to the chat!' });
         },
         disconnectionHandler: (socket, reason) => {
            console.log(`User disconnected from chat: ${socket.id}, reason: ${reason}`);
         }
      });

      // Create a game namespace
      const gameNamespace = this.socketServer.createNamespace({
         name: 'Game',
         path: '/game',
         authentication: true,
         middlewares: [
            {
               name: 'auth',
               handler: (socket, next) => {
                  // Simple authentication check
                  const token = socket.handshake.auth.token;
                  if (token === 'valid-token') {
                     (socket as any).isAuthenticated = true;
                     next();
                  } else {
                     next(new Error('Authentication failed'));
                  }
               }
            }
         ],
         events: [
            {
               name: 'join-game',
               handler: (socket, data) => {
                  const namespace = this.socketServer.getNamespace('/game');
                  namespace?.joinRoom(socket.id, data.gameId, data.password);
               }
            },
            {
               name: 'game-action',
               handler: (socket, data) => {
                  const namespace = this.socketServer.getNamespace('/game');
                  namespace?.sendToRoom(data.gameId, 'game-update', {
                     playerId: socket.id,
                     action: data.action,
                     timestamp: new Date()
                  }, socket.id);
               }
            }
         ]
      });

      // Create rooms in the game namespace
      gameNamespace.createRoom({
         id: 'game-room-1',
         name: 'Beginner Room',
         maxClients: 4,
         isPrivate: false
      });

      gameNamespace.createRoom({
         id: 'game-room-2',
         name: 'Advanced Room',
         maxClients: 2,
         isPrivate: true,
         password: 'advanced123'
      });
   }

   private setupGlobalRooms(): void {
      // Create a global announcement room
      this.socketServer.createRoom({
         id: 'announcements',
         name: 'Global Announcements',
         maxClients: 1000,
         isPrivate: false,
         onJoin: (client) => {
            console.log(`Client ${client.id} joined announcements`);
         },
         onLeave: (client) => {
            console.log(`Client ${client.id} left announcements`);
         },
         onMessage: (client, message) => {
            console.log(`Announcement from ${client.id}:`, message);
         }
      });

      // Create a support room
      this.socketServer.createRoom({
         id: 'support',
         name: 'Customer Support',
         maxClients: 50,
         isPrivate: false,
         onJoin: (client) => {
            // Send welcome message to new support client
            this.socketServer.sendToClient(client.id, 'support-welcome', {
               message: 'Welcome to customer support! How can we help you?',
               timestamp: new Date()
            });
         }
      });
   }

   private setupEventHandlers(): void {
      // Example of sending periodic announcements
      setInterval(() => {
         this.socketServer.sendToRoom('announcements', 'announcement', {
            message: 'This is a periodic system announcement',
            timestamp: new Date(),
            type: 'system'
         });
      }, 300000); // Every 5 minutes

      // Example of monitoring server stats
      setInterval(() => {
         const stats = this.socketServer.getStats();
         console.log('Server Stats:', stats);
      }, 30000); // Every 30 seconds
   }

   // Example methods for manual operations

   /**
    * Send a direct message to a specific client
    */
   sendDirectMessage(clientId: string, message: string): boolean {
      return this.socketServer.sendToClient(clientId, 'direct-message', {
         message,
         timestamp: new Date(),
         type: 'direct'
      });
   }

   /**
    * Broadcast a message to all connected clients
    */
   broadcastMessage(message: string): void {
      this.socketServer.broadcast('global-broadcast', {
         message,
         timestamp: new Date(),
         type: 'broadcast'
      });
   }

   /**
    * Create a temporary room for an event
    */
   createEventRoom(eventId: string, maxParticipants: number = 100): void {
      this.socketServer.createRoom({
         id: `event-${eventId}`,
         name: `Event ${eventId}`,
         maxClients: maxParticipants,
         isPrivate: false,
         onJoin: (client) => {
            this.socketServer.sendToClient(client.id, 'event-joined', {
               eventId,
               message: `Welcome to event ${eventId}!`
            });
         }
      });
   }

   /**
    * Get comprehensive server information
    */
   getServerInfo(): any {
      return this.socketServer.getServerInfo();
   }

   /**
    * Gracefully shutdown the server
    */
   async shutdown(): Promise<void> {
      console.log('Shutting down SocketServer...');
      await this.socketServer.stop();
      console.log('SocketServer shutdown complete');
   }
}

// Usage example
export async function runSocketServerExample(): Promise<void> {
   const example = new SocketServerExample();
   
   try {
      await example.start();
      
      // Example operations
      setTimeout(() => {
         example.broadcastMessage('Server is running smoothly!');
      }, 5000);
      
      setTimeout(() => {
         example.createEventRoom('special-event-001', 50);
      }, 10000);
      
      // Shutdown after 1 hour (for demo purposes)
      setTimeout(async () => {
         await example.shutdown();
         process.exit(0);
      }, 3600000);
      
   } catch (error) {
      console.error('Example failed:', error);
   }
}

// Client-side usage examples (for reference)
export const clientExamples = {
   // Basic connection
   basic: `
   import { io } from 'socket.io-client';
   
   const socket = io('http://localhost:3000');
   
   socket.on('connect', () => {
      console.log('Connected:', socket.id);
   });
   
   socket.on('disconnect', () => {
      console.log('Disconnected');
   });
   `,
   
   // Namespace connection
   namespace: `
   import { io } from 'socket.io-client';
   
   const chatSocket = io('http://localhost:3000/chat');
   
   chatSocket.on('welcome', (data) => {
      console.log('Welcome message:', data);
   });
   
   chatSocket.emit('send-message', { message: 'Hello everyone!' });
   
   chatSocket.on('new-message', (data) => {
      console.log('New message:', data);
   });
   `,
   
   // Authenticated connection
   authenticated: `
   import { io } from 'socket.io-client';
   
   const gameSocket = io('http://localhost:3000/game', {
      auth: {
         token: 'valid-token'
      }
   });
   
   gameSocket.on('connect', () => {
      gameSocket.emit('join-game', { gameId: 'game-room-1' });
   });
   
   gameSocket.on('game-update', (data) => {
      console.log('Game update:', data);
   });
   `,
   
   // Room operations
   rooms: `
   // Join global room
   socket.emit('join-global-room', { roomId: 'announcements' });
   
   // Send message to room
   socket.emit('global-room-message', {
      roomId: 'announcements',
      event: 'user-announcement',
      message: { text: 'Hello room!' }
   });
   
   // Listen for room messages
   socket.on('user-announcement', (data) => {
      console.log('Room message:', data);
   });
   `
};

export default SocketServerExample;
