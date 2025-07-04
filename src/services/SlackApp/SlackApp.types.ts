import { AppOptions } from '@slack/bolt';
import SlackApp from './SlackApp';
import { MicroserviceSetup } from '../Microservice/Microservice.types';

declare global {
   namespace NodeJS {
      interface Process {
         slack: SlackApp;
      }
   }
}

export interface SlackAppSetup extends MicroserviceSetup {
   socketMode?: boolean;
   appToken: string;
   botToken: string;
   signingSecret: string;
   port?: number;
   options?: AppOptions;
}
