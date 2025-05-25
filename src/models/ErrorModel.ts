export default class ErrorModel {
   public error: boolean;
   public message: string;
   public name?: string;
   public stack: string;

   constructor(message: string, name?: string) {
      this.error = true;

      this.message = message;
      this.name = name;
      this.stack = new Error().stack || '-- No stack detected --';

      this.print();
   }

   print() {
      console.error(`[ERROR] ${this.message}`);
      console.error('[STACK]', this.stack);
   }

   static toError(message: string, name?: string) {
      return new ErrorModel(message, name);
   }
}
