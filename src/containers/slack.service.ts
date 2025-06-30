import 'dotenv/config';
import SlackApp from '../services/SlackApp/SlackApp';
import { StringIndexed } from '@slack/bolt';

// Keys
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

if (!SLACK_APP_TOKEN || !SLACK_BOT_TOKEN || !SLACK_SIGNING_SECRET) {
   throw 'You need to provide the Slack Keys as env variables!';
}

global.slack = new SlackApp({
   id: 'slack-service',
   appToken: SLACK_APP_TOKEN,
   botToken: SLACK_BOT_TOKEN,
   signingSecret: SLACK_SIGNING_SECRET,
   onReady: function () {
      console.log('Slack app is running!');
   },
   onError: (error: Error) => {
      console.error('Error in Slack app:', error);
   }
});

slack.onMessage(async ({ message, say }: StringIndexed) => {
   const feedbackTime1 = setTimeout(() => {
      say(`_Thinking... I'll have a response for you shortly!..._`);
   }, 1000);

   const feedbackTime2 = setTimeout(() => {
      say(`_One moment while I get that information for you..._`);
   }, 5000);

   slack.askAssistant(message, async ({ error, data, output, threadID }) => {
      clearTimeout(feedbackTime1);
      clearTimeout(feedbackTime2);

      if (error) {
         return toError(`Something went wrong with askAssistent request! Error caught.`);
      }

      slack.setAiThread(message.user, threadID);
      say(output).catch((err: any) => toError(`Something went wrong after "askAssistent" request when triggering the "say" method! Error caught.`));

      return;
   });
});

