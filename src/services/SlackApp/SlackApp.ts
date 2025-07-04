import { SlackAppSetup } from './SlackApp.types';
import { App, StringIndexed } from '@slack/bolt';
import Microservice from '../Microservice/Microservice';

/**
 * SlackApp class encapsulates the Slack Bolt app instance and provides
 * utility methods for managing AI threads, logging, and handling Slack events.
 */
export default class SlackApp extends Microservice {
   public app: App;
   private _aiThreads: Map<string, string>;

   /**
    * Constructs a SlackApp instance, initializes the Slack Bolt app,
    * and starts the app with the provided configuration.
    * @param setup - Slack app configuration options.
    */
   constructor (setup: SlackAppSetup) {
      super(setup);
      const { socketMode = true, port = 3000, signingSecret, appToken, botToken, options } = setup || {};

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
   }

   /**
    * Retrieves the AI thread ID associated with a Slack user.
    * @param slackUser - The Slack user ID.
    * @returns The thread ID or undefined if not found.
    */
   getAiThread(slackUser: string): string | undefined {
      return this._aiThreads.get(slackUser);
   }

   /**
    * Associates a Slack user with an AI thread ID.
    * @param slackUser - The Slack user ID.
    * @param threadID - The thread ID to associate.
    */
   setAiThread(slackUser: string, threadID: string) {
      this._aiThreads.set(slackUser, threadID);
   }

   /**
    * Logs informational messages using the Slack Bolt app logger.
    * @param data - The data to log.
    */
   log(...data: any) {
      this.app.logger.info('⚡️ ', ...data);
   }

   /**
    * Logs error messages using the Slack Bolt app logger.
    * @param data - The error data to log.
    */
   logError(...data: any) {
      this.app.logger.error('⚡️ ', ...data);
   }

   /**
    * Registers a message event handler for the Slack app.
    * Optionally filters messages containing a specific string.
    * @param callback - The async callback to handle the message event.
    * @param contain - Optional string to filter messages.
    */
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

   /**
    * Registers an action event handler for the Slack app.
    * @param actionID - The action ID to listen for.
    * @param callback - The async callback to handle the action event.
    */
   onAction(actionID: string, callback: (params: StringIndexed) => Promise<void>) {
      if (!actionID || !callback){
         return;
      }

      this.app.action(actionID, callback);
   }

   /**
    * Sends a message to the AI assistant and invokes the callback with the response.
    * @param message - The Slack message object.
    * @param callback - Optional callback to handle the assistant's response.
    */
   askAssistant(message: any, callback?: ({ threadID, output }: any) => any) {
      const input = message.text;
      const threadID = this.getAiThread(message.user);

      this.sendTo('/ai/assistant-generate', { input, threadID }, callback);
   }
}
