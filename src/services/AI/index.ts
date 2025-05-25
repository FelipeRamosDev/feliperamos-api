import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

import type { AISetup, CreateResponseOpt, ResponseInput } from '../types/AI.types.ts';
import { Thread } from 'openai/resources/beta/index.mjs';

export default class AI {
   private _apiKey: string;
   private _threads: Map<string, Thread>;
   private _assistantID?: string;

   public client: OpenAI;
   public isAssistant: boolean;

   constructor (setup: AISetup) {
      const { apiKey, assistantID } = setup || {};

      this._threads = new Map();
      this._apiKey = apiKey;
      this._assistantID = assistantID;

      this.isAssistant = Boolean(this._assistantID);
      this.client = new OpenAI({ apiKey: this._apiKey });
   }

   get responses() {
      return this.client.responses;
   }

   get assistants() {
      return this.client.beta.assistants;
   }

   get threads() {
      return this.client.beta.threads;
   }

   getThread(id: string): Thread | undefined {
      return this._threads.get(id);
   }

   setThread(id: string, value: Thread) {
      if (!id || !value) {
         return;
      }

      this._threads.set(id, value);
   }

   loadFileString(filePath: string) {
      const normalizedPath = path.normalize(filePath);
      return fs.readFileSync(normalizedPath, 'utf-8');
   }

   async createThread(id: string): Promise<Thread> {
      const thread: Thread = await this.threads.create();

      this.setThread(id, thread);
      return thread;
   }

   async createResponse(input: string | ResponseInput[], opt?: CreateResponseOpt) {
      const { model = 'gpt-4.1' } = Object(opt);

      try {
         const response = await this.responses.create({
            model,
            input: input as any,
            ...opt
         });
   
         return response.output_text;
      } catch (err) {
         throw err;
      }
   }

   async threadMessage(threadID: string, message: string) {
      if (!this.isAssistant || this._assistantID === undefined) {
         throw new Error(`You need to provide the "assistantID" on the AI instance construction.`);
      }
      
      try {
         const thread = this.getThread(threadID) || await this.createThread(threadID);

         await this.threads.messages.create(thread.id, {
            role: 'user',
            content: message
         });

         const run = await this.threads.runs.create(thread.id, {
            assistant_id: this._assistantID
         });

         // Poll until complete
         let runStatus;
         do {
            runStatus = await this.threads.runs.retrieve(thread.id, run.id);
            await new Promise(res => setTimeout(res, 1000));
         } while (runStatus.status !== 'completed');

         const messages = await this.threads.messages.list(thread.id);
         const reply = messages.data.find(m => m.role === 'assistant');
         const contentBlock = reply?.content?.[0];

         // Return the assistant's reply as plain text, or undefined if not found
         if (!contentBlock || contentBlock.type !== 'text') {
            return;
         }

         return contentBlock.text.value;
        } catch (err) {
         throw err;
      }
   }
}
