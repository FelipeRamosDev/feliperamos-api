import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ErrorResponseServerAPI from '../models/ErrorResponseServerAPI';
import ErrorServerAPI from '../models/ErrorServerAPI';

const {
   JWT_SECRET
} = process.env;

interface JWTPayload {
   id: string;
   exp: number;
   iat?: number;
   [key: string]: any;
}

export default (req: Request, res: Response, next: NextFunction): void => {
   const authHeader = req.cookies?.token;

   if (!JWT_SECRET) {
      throw new ErrorServerAPI('JWT_SECRET is not defined in the environment variables', 'JWT_SECRET_NOT_DEFINED');
   }

   if (!authHeader) {
      new ErrorResponseServerAPI('No token provided', 401, 'MISSING_TOKEN').send(res);
      return;
   }

   jwt.verify(authHeader, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (err) {
         new ErrorResponseServerAPI('Invalid token', 401, 'INVALID_TOKEN').send(res);
         return;
      }

      if (!decoded || typeof decoded === 'string') {
         new ErrorResponseServerAPI('Invalid token payload', 401, 'INVALID_TOKEN_PAYLOAD').send(res);
         return;
      }

      const payload = decoded as JWTPayload;
      if (payload.exp < (Date.now() / 1000)) {
         new ErrorResponseServerAPI('Token has expired', 401, 'EXPIRED_TOKEN').send(res);
         return;
      }

      if (payload.id !== req.session.user?.id?.toString()) {
         new ErrorResponseServerAPI('User ID does not match the token', 403, 'FORBIDDEN').send(res);
         return;
      }

      next();
   });
};
