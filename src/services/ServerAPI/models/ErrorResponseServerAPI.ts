import { Response } from 'express';
import ErrorAPIServer from './ErrorServerAPI';

export default class ErrorResponseServerAPI extends Error {
   public error: boolean;
   public code: string;
   public status: number;
   public name: string;

   constructor(message = 'Internal server error!', status = 500, code = 'REQUEST_HTTP_ERROR') {
      super(message);

      this.error = true;
      this.code = code;
      this.status = status;

      this.name = '[ErrorResponseServerAPI]';
   }

   send(res: Response): Response {
      if (!res) {
         throw new ErrorAPIServer('Response object is required to send an error response.', 'RESPONSE_OBJECT_REQUIRED');
      }

      return res.status(this.status).send({
         error: this.error,
         code: this.code,
         message: this.message
      });
   }
}
