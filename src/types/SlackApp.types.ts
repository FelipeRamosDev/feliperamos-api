import { AppOptions } from '@slack/bolt';
import SlackApp from '../services/SlackApp';

declare global {
   namespace NodeJS {
      interface Process {
         slack: SlackApp;
      }
   }
}

export interface SlackAppSetup extends AppOptions {
   socketMode?: boolean;
   appToken: string;
   botToken: string;
   signingSecret: string;
}
