export default class ErrorRoute extends Error {
   error: boolean;
   code: string;
   data?: any;

   constructor(message: string = 'Unknown route error!', code: string = 'ROUTE_ERROR', data?: any) {
      super(message);

      this.error = true;
      this.code = code;
      this.name = '[ErrorRoute]';
      this.data = data || null;
   }
}
