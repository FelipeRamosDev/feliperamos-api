export default class ErrorSocketServer extends Error {
   public code: string;

   constructor (message: string = 'Socket Server Error!', code: string = 'SOCKET_SERVER_ERROR') {
      super(message);

      this.name = '[SocketServer]';
      this.code = code;
   }
}
