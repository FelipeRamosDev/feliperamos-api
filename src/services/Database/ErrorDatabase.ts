class ErrorDatabase extends Error {
   public error: boolean;
   public code: string;
   public data: any;

   constructor(
      message: string = 'Unknown database error!',
      code: string = 'DATABASE_ERROR',
      data?: any
   ) {
      super(message);

      this.error = true;
      this.code = code;
      this.name = '[Database]';
      this.data = data || null;
   }
}

export default ErrorDatabase;
