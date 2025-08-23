import 'dotenv/config';
import { ServerAPI, SocketServer } from '../services';
import { cvChatNS, customCVNS } from './namespaces';

const {
   SSL_KEY_PATH,
   SSL_CERT_PATH,
   API_SECRET = 'default_secret'
} = process.env;

const SOCKET_SERVER_PORT = Number(process.env.SOCKET_SERVER_PORT || 5000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : undefined;
const sslConfig = SSL_KEY_PATH && SSL_CERT_PATH ? {
   keySSLPath: SSL_KEY_PATH,
   certSSLPath: SSL_CERT_PATH
} : undefined;

const server = new ServerAPI({
   id: 'socket-http-server',
   API_SECRET: API_SECRET,
   corsOrigin: CORS_ORIGIN,
   sslConfig: sslConfig,
   PORT: SOCKET_SERVER_PORT,
   onError: function (error) {
      console.error(`Socket HTTP Server encountered an error when constructing the ServerAPI!`, error);
      process.exit(1);
   }
});

const socketServer = new SocketServer({
   id: 'socket-server',
   serverAPI: server,
   namespaces: [ cvChatNS, customCVNS ],
   onError(error) {
      console.error('Socket Server encountered an error:', error);
      process.exit(1);
   }
});

socketServer.start().then(() => {
   console.log(`Socket Server is running on port ${SOCKET_SERVER_PORT}`);
}).catch((error) => {
   console.error('Error starting Socket Server:', error);
   process.exit(1);
});

export default socketServer;
