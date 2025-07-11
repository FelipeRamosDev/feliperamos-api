import { NextFunction, Request, Response } from "express";
import ErrorResponseServerAPI from "../models/ErrorResponseServerAPI";

export default (req: Request, res: Response, next: NextFunction): void => {
   const userRole = req.session?.user?.role;

   if (!userRole) {
      new ErrorResponseServerAPI('User role is not available!', 403, 'USER_ROLE_NOT_FOUND').send(res);
      return;
   }

   if (!req.route.rules?.includes(userRole)) {
      new ErrorResponseServerAPI('User role is not authorized for this route!', 403, 'USER_ROLE_NOT_AUTHORIZED').send(res);
      return;
   }

   next();
}
