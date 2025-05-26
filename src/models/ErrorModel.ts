/**
 * ErrorModel class provides a standardized structure for error handling and logging.
 * It captures error details, prints them to the console, and can be instantiated directly or via the static toError method.
 */
export default class ErrorModel {
   public error: boolean;
   public message: string;
   public name?: string;
   public stack: string;

   /**
    * Constructs an ErrorModel instance with the provided message and optional name.
    * Automatically captures the stack trace and prints the error details.
    * @param message - The error message.
    * @param name - Optional name for the error.
    */
   constructor(message: string, name?: string) {
      this.error = true;

      this.message = message;
      this.name = name;
      this.stack = new Error().stack || '-- No stack detected --';

      this.print();
   }

   /**
    * Prints the error message and stack trace to the console.
    */
   print() {
      console.error(`[ERROR] ${this.message}`);
      console.error('[STACK]', this.stack);
   }

   /**
    * Static factory method to create a new ErrorModel instance.
    * @param message - The error message.
    * @param name - Optional name for the error.
    * @returns A new ErrorModel instance.
    */
   static toError(message: string, name?: string) {
      return new ErrorModel(message, name);
   }
}
