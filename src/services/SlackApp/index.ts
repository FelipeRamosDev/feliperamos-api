import { SlackAppSetup } from '../types/SlackApp.types';
import { App, StringIndexed } from '@slack/bolt';

export default class SlackApp {
   public app: App;
   private _aiThreads: Map<string, string>;

   constructor (setup: SlackAppSetup) {
      const { socketMode = true, port = 3000, signingSecret, appToken, botToken, ...options } = setup || {};

      this._aiThreads = new Map();
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

   getAiThread(slackUser: string) {
      return this._aiThreads.get(slackUser);
   }

   setAiThread(slackUser: string, threadID: string) {
      this._aiThreads.set(slackUser, threadID);
   }

   log(...data: any) {
      this.app.logger.info('⚡️ ', ...data);
   }

   logError(...data: any) {
      this.app.logger.error('⚡️ ', ...data);
   }

   onMessage(callback: (params: StringIndexed) => Promise<void>, contain?: string) {
      if (!callback) {
         return;
      }

      if (contain) {
         this.app.message(contain, callback);
      } else {
         this.app.message(callback);
      }
   }

   onAction(actionID: string, callback: (params: StringIndexed) => Promise<void>) {
      if (!actionID || !callback){
         return;
      }

      this.app.action(actionID, callback);
   }

   askAssistant(message: any, callback?: ({ threadID, output }: any) => any) {
      const input = message.text;
      const threadID = this.getAiThread(message.user);

      instance.sendTo('/ai-cpu/assistant-message', { input, threadID }, callback);
   }
}
