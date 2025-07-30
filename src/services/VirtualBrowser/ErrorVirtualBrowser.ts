class ErrorVirtualBrowser extends Error {
   public code: string;

   constructor(message: string = 'Virtual Browser Error', code: string = 'VIRTUAL_BROWSER_ERROR') {
      super(message);

      this.name = '[VirtualBrowser]';
      this.code = code;
      this.message = message;
   }
}

export default ErrorVirtualBrowser
