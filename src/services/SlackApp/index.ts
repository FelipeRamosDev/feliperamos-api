import { SlackAppSetup } from '../types/SlackApp.types';
import { App } from '@slack/bolt';

export default class SlackApp {
   public app: App;

   constructor (setup: SlackAppSetup) {
      const { socketMode = true, port = 3000, signingSecret, appToken, botToken, ...options } = setup || {};

      this.app = new App({
         token: botToken,
         appToken,
         signingSecret,
         socketMode,
         port,
         ...options
      });

      this.app.start().then(() => {
         this.log('Bolt app is running!');
      }).catch(err => {
         this.logError(err);
      });

      // Declaring the thread on the current process to be used anywhere on on the worker thread.
      process.slack = this;
   }

   log(...data: any) {
      this.app.logger.info('⚡️ ', ...data);
   }

   logError(...data: any) {
      this.app.logger.error('⚡️ ', ...data);
   }
}
