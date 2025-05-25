import { AppOptions } from '@slack/bolt';
import SlackApp from '../SlackApp';

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

