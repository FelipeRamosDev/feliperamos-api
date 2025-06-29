// Declaring globals
import '../../global/globals';

import { Request, Response, NextFunction, RequestHandler } from 'express';

// Import types
import type {
   HTTPMethod,
   BodySchema,
   AuthenticatedRequest,
   RouteSetup,
   RouteError,
   // BodyValidationMiddleware,
   // AuthVerifyMiddleware
} from './Route.types';

// Note: These would typically be imported as ES modules, but keeping as require for now
// to maintain compatibility with existing middleware structure
// const authVerify: AuthVerifyMiddleware = require('4hands-api/src/middlewares/authVerify');
// const bodyValidation: BodyValidationMiddleware = require('4hands-api/src/middlewares/bodyValidation');

/**
 * Represents an API route configuration.
 * @class Route
 * @namespace Models
 */
class Route {
   public method: HTTPMethod;
   public routePath: string;
   public rules?: string[];
   public controller: RequestHandler;
   public middlewares: RequestHandler[];
   public bodySchema?: BodySchema;
   public authRule?: string;

   /**
    * Creates a new instance of the Route class.
    * @param setup - The setup object containing endpoint details and configurations.
    * @throws {Error} If setup parameters are invalid.
    */
   constructor(setup: RouteSetup) {
      const { method, routePath, rules, controller, bodySchema, isAuthRoute, authRule, middlewares, noValidateBody } = setup;

      // Validation checks for required parameters
      if (!routePath) {
         throw new Error('The "routePath" param is required to declare a new endpoint!');
      }

      // Validation checks for required parameters
      if (rules && !Array.isArray(rules)) {
         throw new Error('The "rules" param must be an array!');
      }

      if (typeof controller !== 'function') {
         throw new Error('The "controller" param is required to be a function when declaring a new endpoint!');
      }

      /**
       * The HTTP method for the endpoint.
       */
      this.method = method || 'GET';

      /**
       * The path of the endpoint's route.
       */
      this.routePath = routePath;

      /**
       * The allowed user rules for the endpoint.
       */
      this.rules = rules;

      /**
       * The controller function handling the endpoint logic.
       */
      this.controller = controller;

      /**
       * Middleware functions to be applied to the endpoint.
       */
      this.middlewares = [];

      // // Adding authentication middleware if required
      // if (isAuthRoute) {
      //    this.authRule = authRule;
      //    this.middlewares.push(authVerify);

      //    // Validation the user rules
      //    if (this.rules && this.rules.length) {
      //       this.middlewares.push(this.validateRule.bind(this));
      //    }
      // }

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

   /**
    * Updates the body schema of the endpoint.
    * @param data - The data to merge with the existing body schema
    */
   updateBodySchema(data: Partial<BodySchema>): void {
      this.bodySchema = { ...this.bodySchema, ...data };
   }

   /**
    * This asynchronous function validates the user's rules.
    * 
    * @param req - The request object, containing session information and user rules.
    * @param res - The response object, used to send responses back to the client.
    * @param next - The next middleware function in the Express.js routing process.
    */
   async validateRule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      const userRules = req.session.user?.rules;
      const searchRules = this.rules?.find(rule => {
         const searchUserRules = userRules?.find((userRule: string) => userRule === rule);
         return searchUserRules;
      });

      if (!searchRules) {
         res.status(401).send(global.toError(
            `User's rules is not allowed for this endpoint!`,
            'USER_RULE_NOT_AUTHORIZED'
         ));
         return;
      }

      next();
   }
}

export default Route;
