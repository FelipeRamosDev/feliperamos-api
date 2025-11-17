class ErrorEventEndpoint extends Error {
   public error: boolean;
   public code: string;
   constructor(message: string, code: string = 'EVENT_ENDPOINT_ERROR') {
      super(message);

      this.name = 'EventEndpoint';
      this.code = code;
      this.error = true;
   }

   toObject() {
      return {
         error: this.error,
         message: this.message,
         code: this.code,
      };
   }
}

export default ErrorEventEndpoint;
