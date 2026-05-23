import 'dotenv/config';
import { ServerAPI, SocketServer } from '../../services';
import messageChunkEvent from './events/message-chunk.event';
import messageEndEvent from './events/message-end.event';
import messageErrorEvent from './events/message-error.event';
import { chatNS, opportunityNS } from './namespaces';

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

global.socket = new SocketServer({
   serverAPI: server,
   containerName: 'socket-server',
   namespaces: [ chatNS, opportunityNS ],
   endpoints: [ messageChunkEvent, messageEndEvent, messageErrorEvent ],
   onError: function (error) {
      console.error(`Socket HTTP Server encountered an error when constructing the SocketServer!`, error);
      process.exit(1);
   }
});

global.socket.start().then(() => {
   console.log(`Socket Server is running on port ${SOCKET_SERVER_PORT}`);
}).catch((error) => {
   console.error('Error starting Socket Server:', error);
   process.exit(1);
});

export default global.socket;
