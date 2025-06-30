# SocketServer Service

A comprehensive Socket.IO server implementation that integrates with the ServerAPI service to provide real-time communication capabilities with advanced features like namespaces, rooms, client management, and more.

## Features

- **Socket.IO Integration**: Full Socket.IO server implementation with ServerAPI
- **Namespace Management**: Create and manage namespaces similar to HTTP routes
- **Room Management**: Create, join, leave, and manage rooms with advanced features
- **Client Management**: Track and manage individual client connections
- **Message Routing**: Send messages to specific clients, rooms, or broadcast globally
- **Authentication**: Support for namespace-level authentication
- **Middleware Support**: Add custom middleware to namespaces
- **Statistics Tracking**: Monitor connections, messages, and server performance
- **SSL Support**: Automatic SSL support when ServerAPI is configured with SSL

## Architecture

The SocketServer service consists of four main classes:

1. **SocketServer**: Main server class that manages the entire Socket.IO infrastructure
2. **SocketNamespace**: Manages individual namespaces with route-like functionality
3. **SocketRoom**: Manages individual rooms with member tracking and permissions
4. **SocketClient**: Represents individual client connections with enhanced functionality

## Quick Start

```typescript
import { SocketServer } from './services/SockerServer';
import ServerAPI from './services/ServerAPI/ServerAPI';

// Initialize ServerAPI
const serverAPI = new ServerAPI({
   id: 'my-api',
   projectName: 'My Project',
   API_SECRET: 'your-secret',
   PORT: 3000
});

// Initialize SocketServer
const socketServer = new SocketServer({
   id: 'my-socket-server',
   serverAPI: serverAPI,
   corsOrigin: ['http://localhost:3000']
});

// Start the server
await socketServer.start();
```

## Creating Namespaces

Namespaces in SocketServer work similar to HTTP routes, allowing you to organize different types of real-time functionality:

```typescript
// Create a chat namespace
const chatNamespace = socketServer.createNamespace({
   name: 'Chat',
   path: '/chat',
   authentication: false,
   middlewares: [
      {
         name: 'logger',
         handler: (socket, next) => {
            console.log(`Connection attempt: ${socket.id}`);
            next();
         }
      }
   ],
   events: [
      {
         name: 'send-message',
         handler: (socket, data) => {
            // Handle incoming messages
            const namespace = socketServer.getNamespace('/chat');
            namespace?.broadcast('new-message', data, socket.id);
         }
      }
   ],
   connectionHandler: (socket) => {
      socket.emit('welcome', { message: 'Welcome to chat!' });
   }
});
```

## Room Management

### Creating Rooms

```typescript
// Create a global room (available across all namespaces)
const globalRoom = socketServer.createRoom({
   id: 'announcements',
   name: 'Global Announcements',
   maxClients: 1000,
   isPrivate: false,
   onJoin: (client) => {
      console.log(`Client ${client.id} joined announcements`);
   },
   onLeave: (client) => {
      console.log(`Client ${client.id} left announcements`);
   }
});

// Create a namespace-specific room
const gameRoom = chatNamespace.createRoom({
   id: 'game-room-1',
   name: 'Beginner Game Room',
   maxClients: 4,
   isPrivate: true,
   password: 'secret123'
});
```

### Joining and Leaving Rooms

```typescript
// Join a global room
await socketServer.joinRoom(clientId, 'announcements');

// Join a namespace room with password
await chatNamespace.joinRoom(clientId, 'game-room-1', 'secret123');

// Leave a room
await socketServer.leaveRoom(clientId, 'announcements');
```

## Message Sending

### Send to Specific Client

```typescript
// Send message to a specific client
socketServer.sendToClient(clientId, 'notification', {
   message: 'Hello!',
   timestamp: new Date()
});
```

### Send to Room

```typescript
// Send message to all clients in a room
socketServer.sendToRoom('announcements', 'announcement', {
   message: 'System maintenance in 10 minutes',
   priority: 'high'
});

// Send to room excluding sender
socketServer.sendToRoom('chat-room', 'new-message', messageData, senderClientId);
```

### Broadcast Messages

```typescript
// Broadcast to all connected clients
socketServer.broadcast('global-notification', {
   message: 'Server will restart in 5 minutes'
});

// Broadcast within a namespace
const namespace = socketServer.getNamespace('/chat');
namespace?.broadcast('chat-announcement', announcementData);
```

### Send to Multiple Clients

```typescript
// Send to specific list of clients
const clientIds = ['client1', 'client2', 'client3'];
const sentCount = socketServer.sendToClients(clientIds, 'batch-message', data);
console.log(`Message sent to ${sentCount} clients`);
```

## Client Management

### Get Client Information

```typescript
// Get specific client
const client = socketServer.getClient(clientId);
if (client) {
   console.log('Client info:', client.info);
   console.log('Client status:', client.getStatus());
}

// Get all clients
const allClients = socketServer.clients;
console.log(`Total clients: ${allClients.length}`);
```

### Disconnect Clients

```typescript
// Disconnect specific client
socketServer.disconnectClient(clientId, 'Admin kicked user');

// Close client connection (alias)
socketServer.closeConnection(clientId, 'Connection terminated');
```

## Authentication

### Namespace-level Authentication

```typescript
const secureNamespace = socketServer.createNamespace({
   name: 'Secure Area',
   path: '/admin',
   authentication: true,
   middlewares: [
      {
         name: 'auth',
         handler: (socket, next) => {
            const token = socket.handshake.auth.token;
            if (isValidToken(token)) {
               (socket as any).isAuthenticated = true;
               (socket as any).userId = getUserIdFromToken(token);
               next();
            } else {
               next(new Error('Authentication failed'));
            }
         }
      }
   ]
});
```

### Client-side Authentication

```javascript
// Client connection with authentication
const socket = io('http://localhost:3000/admin', {
   auth: {
      token: 'your-jwt-token'
   }
});
```

## Server Statistics

```typescript
// Get server statistics
const stats = socketServer.getStats();
console.log('Server stats:', stats);

// Get detailed server information
const serverInfo = socketServer.getServerInfo();
console.log('Server info:', serverInfo);
```

## Event Handling

### Default Events

The SocketServer automatically handles several built-in events:

- `connection`: New client connected
- `disconnect`: Client disconnected
- `join-global-room`: Join a global room
- `leave-global-room`: Leave a global room
- `global-room-message`: Send message to global room

### Custom Events

```typescript
// Add custom event handlers to namespaces
namespace.on('custom-event', (socket, data) => {
   // Handle custom event
   console.log('Custom event received:', data);
   socket.emit('custom-response', { status: 'received' });
});
```

## Error Handling

```typescript
// Server-side error handling
socketServer.io.on('connection', (socket) => {
   socket.on('error', (error) => {
      console.error(`Socket error: ${socket.id}`, error);
   });
});

// Handle connection errors
socketServer.io.engine.on('connection_error', (err) => {
   console.error('Connection error:', err);
});
```

## Advanced Features

### Room Permissions

```typescript
// Create private room with password
const privateRoom = socketServer.createRoom({
   id: 'private-meeting',
   name: 'Private Meeting Room',
   maxClients: 10,
   isPrivate: true,
   password: 'meeting123',
   onJoin: (client) => {
      // Custom join logic
      socketServer.sendToRoom('private-meeting', 'user-joined', {
         userId: client.userId,
         username: client.username,
         timestamp: new Date()
      });
   }
});
```

### Client Metadata

```typescript
// Set client metadata
const client = socketServer.getClient(clientId);
if (client) {
   client.setUser('user123', 'John Doe');
   client.setMetadata('role', 'admin');
   client.setMetadata('permissions', ['read', 'write', 'delete']);
}
```

### Room Management

```typescript
// Get room statistics
const room = socketServer.getRoom('chat-room');
if (room) {
   const stats = room.getStats();
   console.log('Room stats:', stats);
   
   // Kick user from room
   await room.kickClient(clientId, 'Violation of rules');
   
   // Ban user from room
   await room.banClient(clientId, 'Permanent ban');
}
```

### Cleanup and Shutdown

```typescript
// Graceful shutdown
await socketServer.stop();

// Close specific room
socketServer.closeRoom('temporary-room');

// Delete namespace
socketServer.deleteNamespace('/temporary-namespace');
```

## Configuration Options

### SocketServer Options

```typescript
interface SocketServerSetup {
   serverAPI: ServerAPI;           // Required: ServerAPI instance
   corsOrigin?: string[];          // CORS origins
   allowEIO3?: boolean;           // Allow Engine.IO v3 clients
   transports?: string[];         // Available transports
   pingTimeout?: number;          // Ping timeout (ms)
   pingInterval?: number;         // Ping interval (ms)
   upgradeTimeout?: number;       // Upgrade timeout (ms)
   maxHttpBufferSize?: number;    // Max HTTP buffer size
   allowRequest?: Function;       // Custom request validation
}
```

### Namespace Configuration

```typescript
interface NamespaceConfig {
   name: string;                  // Namespace display name
   path: string;                  // Namespace path (e.g., '/chat')
   middlewares?: NamespaceMiddleware[];
   events?: NamespaceEvent[];
   authentication?: boolean;      // Require authentication
   connectionHandler?: Function;  // Custom connection handler
   disconnectionHandler?: Function; // Custom disconnection handler
}
```

### Room Configuration

```typescript
interface RoomConfig {
   id: string;                    // Unique room ID
   name?: string;                 // Display name
   namespace?: string;            // Associated namespace
   maxClients?: number;           // Maximum clients allowed
   isPrivate?: boolean;           // Private room flag
   password?: string;             // Room password
   metadata?: Record<string, any>; // Custom metadata
   onJoin?: Function;             // Join callback
   onLeave?: Function;            // Leave callback
   onMessage?: Function;          // Message callback
}
```

## Best Practices

1. **Use Namespaces**: Organize different functionality into separate namespaces
2. **Implement Authentication**: Use middleware for secure namespaces
3. **Monitor Statistics**: Regular monitoring of server performance
4. **Handle Errors**: Implement comprehensive error handling
5. **Graceful Shutdown**: Always close connections properly
6. **Room Limits**: Set appropriate room size limits
7. **Client Validation**: Validate client data and permissions
8. **Resource Cleanup**: Clean up inactive rooms and connections

## Troubleshooting

### Common Issues

1. **Connection Failures**: Check CORS configuration
2. **Authentication Errors**: Verify token validation logic
3. **Room Join Failures**: Check room capacity and permissions
4. **Message Delivery**: Verify client is connected and active
5. **Memory Leaks**: Ensure proper cleanup of clients and rooms

### Debug Mode

Enable debug logging for troubleshooting:

```bash
DEBUG=socket.io* node your-app.js
```

## Examples

See `SocketServer.example.ts` for comprehensive usage examples including:
- Basic server setup
- Namespace creation with authentication
- Room management
- Message broadcasting
- Client-side connection examples

## API Reference

For detailed API documentation, refer to the TypeScript definitions in `SocketServer.types.ts` and the individual class files.
