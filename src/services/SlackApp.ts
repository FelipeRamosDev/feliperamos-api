import { App, AppOptions, StringIndexed } from '@slack/bolt';

export default class SlackApp {
   public app: App;

   constructor (botToken: string, signingSecret: string, appToken: string, opt?: AppOptions) {
      this.app = new App({
         socketMode: true,
         port: 3000,
         token: botToken,
         signingSecret,
         appToken,
         ...opt
      });

      this.app.start().then(() => {
         this.app.logger.info('⚡️ Bolt app is running!');
      }).catch(err => {
         throw err;
      });
   }

   addMessageListener(callback: ({ message, say }: StringIndexed) => Promise<void>, containsMsg?: string) {
      if (!callback) {
         return;
      }

      if (containsMsg) {
         this.app.message(containsMsg, callback);
      } else {
         this.app.message(callback);
      }
   }

   addAction(actionID: string, action: ({ message, ack, say }: StringIndexed) => Promise<void>) {
      this.app.action(actionID, action);
   }
}
