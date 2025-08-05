class ErrorVirtualBrowser extends Error {
   public code: string;
   public error: boolean;

   constructor(message: string = 'Virtual Browser Error', code: string = 'VIRTUAL_BROWSER_ERROR') {
      super(message);

      this.name = '[VirtualBrowser]';
      this.error = true;
      this.code = code;
      this.message = message;
   }
}

export default ErrorVirtualBrowser
