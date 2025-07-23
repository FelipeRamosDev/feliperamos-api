import { RequestHandler } from 'express';

// Import types
import type {
   HTTPMethod,
   BodySchema,
   RouteSetup,
} from './Route.types';
import ErrorRoute from './ErrorRoute';
import authenticateToken from '../ServerAPI/middlewares/authenticateToken';
import validateRole from '../ServerAPI/middlewares/validateRole';

/**
 * Represents an API route configuration.
 * @class Route
 */
class Route {
   public method: HTTPMethod;
   public routePath: string;
   public allowedRoles: string[];
   public controller: RequestHandler;
   public middlewares: RequestHandler[];
   public bodySchema?: BodySchema;
   public authRule?: string;

   constructor(setup: RouteSetup) {
      const {
         method,
         routePath,
         allowedRoles = [],
         controller,
         useAuth,
         authRule,
         middlewares,
         bodySchema,
         noValidateBody
      } = setup;

      // Validation checks for required parameters
      if (!routePath) {
         throw new ErrorRoute('The "routePath" param is required when declaring a new endpoint!', 'ROUTE_PATH_REQUIRED')
      }

      // Validation checks for required parameters
      if (!Array.isArray(allowedRoles)) {
         throw new ErrorRoute('The "allowedRoles" param must be an array when declaring a new endpoint!', 'ROUTE_RULES_INVALID');
      }

      if (typeof controller !== 'function') {
         throw new ErrorRoute('The "controller" param is required to be a function when declaring a new endpoint!', 'ROUTE_CONTROLLER_INVALID');
      }

      this.method = method || 'GET';
      this.routePath = routePath;
      this.allowedRoles = allowedRoles;
      this.controller = controller;
      this.middlewares = [];

      // // Adding authentication middleware if required
      if (useAuth) {
         this.authRule = authRule;
         this.middlewares.push(authenticateToken);

         // Validating user allowedRoles
         if (this.allowedRoles.length) {
            this.middlewares.push(validateRole(this));
         }
      }

      // Adding body validation middleware if body schema provided and validation is not skipped
      // if (bodySchema && !noValidateBody) {
      //    this.bodySchema = bodySchema;
      //    this.middlewares.push((req: Request, res: Response, next: NextFunction) => {
      //       bodyValidation(req, res, next, this.bodySchema!);
      //    });
      // }

      // Adding custom middlewares to the endpoint
      if (Array.isArray(middlewares)) {
         middlewares.forEach(item => {
            if (typeof item === 'function') {
               this.middlewares.push(item);
            }
         });
      }
   }

   updateBodySchema(data: Partial<BodySchema>): void {
      this.bodySchema = { ...this.bodySchema, ...data };
   }
}

export default Route;
