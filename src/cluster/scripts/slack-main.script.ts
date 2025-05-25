import Thread from '../../services/ClusterManager/Thread';
import slackMainThread from '../threads/slack-main.thread';
import SlackApp from '../../services/SlackApp';

// Keys
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

if (!SLACK_APP_TOKEN || !SLACK_BOT_TOKEN || !SLACK_SIGNING_SECRET) {
   throw 'You need to provide the Slack Keys as env variables!';
}

const thread = new Thread(slackMainThread);
thread.init();

const slack = new SlackApp({
   appToken: SLACK_APP_TOKEN,
   botToken: SLACK_BOT_TOKEN,
   signingSecret: SLACK_SIGNING_SECRET
});

slack.onMessage(async ({ message, say }) => {
   const feedbackTime1 = setTimeout(() => {
      say(`_Thinking... I'll have a response for you shortly!..._`);
   }, 1000);

   const feedbackTime2 = setTimeout(() => {
      say(`_One moment while I get that information for you..._`);
   }, 5000);

   slack.askAssistant(message, async ({ error, data, output, threadID }) => {
      if (error) {
         return toError(`Something went wrong with askAssistent request! Error caught.`);
      }

      clearTimeout(feedbackTime1);
      clearTimeout(feedbackTime2);

      slack.setAiThread(message.user, threadID);
      say(output).catch((err: any) => toError(`Something went wrong after "askAssistent" request when triggering the "say" method! Error caught.`));
   });
});
