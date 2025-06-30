import 'dotenv/config';
import { ServerAPI, SocketServer } from '../services';
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const {
   SSL_KEY_PATH,
   SSL_CERT_PATH,
   API_SECRET = 'default_secret'
} = process.env;

const sslConfig = SSL_KEY_PATH && SSL_CERT_PATH ? {
   keySSLPath: SSL_KEY_PATH,
   certSSLPath: SSL_CERT_PATH
} : undefined;

const serverAPI = new ServerAPI({
   id: 'socket-server-http',
   PORT: 5000,
   API_SECRET,
   sslConfig,
   corsOrigin: ['http://localhost:3000'],
   onReady: () => {
      console.log('[Socket Server] HTTP server is ready!');
   },
   onError: (err) => {
      console.error('[Socket Server] HTTP server encountered an error:', err);
   }
});

const socketServer = new SocketServer({
   id: 'socket-server',
   serverAPI
});

socketServer.createNamespace({
   name: 'cv-chat',
   path: '/cv-chat',
   connectionHandler: (socket) => {
      console.log('[Socket Server] New client connected to cv-chat namespace:', socket.id);
   },
   events: [
      {
         name: 'test-event',
         handler: (socket, data) => {
            console.log('[Socket Server] Received test-event:', data);
         }
      }
   ]
});

socketServer.start().then(() => {
   console.log('[Socket Server] Socket server is running!');
}).catch(err => {
   console.error('[Socket Server] Failed to start socket server:', err);
});

export default socketServer;
