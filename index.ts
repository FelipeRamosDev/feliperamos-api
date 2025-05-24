import 'dotenv/config';
import SlackApp from './src/services/SlackApp';
import AI from './src/services/AI';

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!SLACK_SIGNING_SECRET || !SLACK_BOT_TOKEN || !SLACK_APP_TOKEN || !OPENAI_API_KEY) {
   throw new Error(`It's required to provide the .env variables!`);
}

const ai = new AI(OPENAI_API_KEY, { assistantID: OPENAI_ASSISTANT_ID });
const slack = new SlackApp(SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN);

slack.addMessageListener(async ({ message, say }) => {
   try {
      const output = await ai.threadMessage(message.user, message.text);
      await say(output);
   } catch (err) {
      console.error(err);
      await say(`Something went wrong, try again!`);
   }
});
