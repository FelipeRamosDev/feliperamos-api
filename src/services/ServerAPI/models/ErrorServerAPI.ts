export default class ErrorServerAPI extends Error {
   error: boolean;
   code: string;
   name: string;
   data?: any;

   constructor(message:string = 'Unknown API server error!', code:string = 'API_SERVER_ERROR', data?: any) {
      super(message);

      this.error = true;
      this.code = code;
      this.name = '[ErrorServerAPI]';
      this.data = data || null;
   }
}
