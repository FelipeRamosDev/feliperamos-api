import 'dotenv/config';
import { ServerAPI, SocketServer } from '../services';

const {
   SSL_KEY_PATH,
   SSL_CERT_PATH,
   API_SECRET = 'default_secret'
} = process.env;

const sslConfig = SSL_KEY_PATH && SSL_CERT_PATH ? {
   keySSLPath: SSL_KEY_PATH,
   certSSLPath: SSL_CERT_PATH
} : undefined;
