class ErrorEventEndpoint extends Error {
   public error: boolean;
   public code: string;
   constructor(message: string, code: string = 'EVENT_ENDPOINT_ERROR') {
      super(message);

      this.name = 'EventEndpoint';
      this.code = code;
      this.error = true;
   }
}

export default ErrorEventEndpoint;
