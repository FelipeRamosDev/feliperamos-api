interface ResourceType {
   name: string;
   message: string;
}

declare const Resource: {
   error(name: string): ResourceType | undefined;
};

type MergeObject = { [key: string]: any };

class ErrorLog {
   error: boolean;
   name?: string;
   message?: string;
   msg?: string;
   code?: string | number;
   type?: string;
   stack?: string;
   [key: string]: any; // allow dynamic assignment

   constructor(err?: any, merge: MergeObject = {}) {
      this.error = true;

      if (!err) {
         this.name = 'UNKNOWN_ERROR';
         this.message = 'An unknown error was caught!';
      } else if (typeof err === 'string') {
         const rsc = Resource.error(err);
         if (rsc) {
            this.name = rsc.name;
            this.message = rsc.message;
         } else {
            this.message = err;
         }
      } else if (typeof err === 'object' && !Array.isArray(err)) {
         const { code, name, message, msg, type, stack } = err;

         if (code) this.code = code;
         if (name) this.name = name;
         if (message || msg) {
            this.message = message || msg;
            this.msg = msg;
         }
         if (type) this.type = type;
         if (stack) this.stack = stack;
      }

      if (!this.stack) {
         this.stack = new Error().stack;
      }

      if (merge && typeof merge === 'object' && !Array.isArray(merge)) {
         Object.keys(merge).forEach((key) => {
            this[key] = merge[key];
         });
      }
   }

   get stackArray(): string[] {
      if (!this.stack) return [];
      const array = this.stack.split('\n');
      array.splice(0, 1);
      return array.map((item) => item.replace('    at ', ''));
   }

   stackTemplate(): string {
      const date = new Date();
      const msg = this.message || this.msg || '';
      let out = `\n[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}]\n`;

      if (this.name || msg) out += `${this.name || 'Error'}: ${msg}\n`;
      if (this.stack) out += 'Stack: ' + this.stackArray.join('\n    ');
      out +=
         '\n--------------------------------------------------------------------------------------------------------------------------------\n\n';

      return out;
   }

   toObject(): object {
      return { ...this };
   }

   print(): void {
      console.error(this.stackTemplate(), '\n');
   }

   printWarn(): void {
      console.warn(this.stackTemplate(), '\n');
   }

   append(): void {
      // Method intentionally left blank
   }

   static logError(err: any): ErrorLog {
      const error = new ErrorLog(err);
      console.error(error.stackTemplate());
      return error;
   }

   static toError(err: any): ErrorLog {
      return new ErrorLog(err);
   }
}

export default ErrorLog;
