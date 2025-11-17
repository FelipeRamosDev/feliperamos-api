export default class ErrorAICore extends Error {
   public error: boolean;
   public code: string;

   constructor(message?: string, code?: string) {
      super(message || 'An error occurred in the AICore service.');

      this.error = true;
      this.code = code || 'AICORE_ERROR';
      this.name = '[AICore]';
   }
}
