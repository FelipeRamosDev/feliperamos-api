import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

import type { AISetup, CreateResponseOpt, ResponseInput } from './AI.types';
import type { Thread } from 'openai/resources/beta/threads/threads';
import Microservice from '../Microservice/Microservice';
import ErrorModel from '../../models/ErrorModel';

/**
 * AI class for managing OpenAI assistant interactions, thread management, and message handling.
 */
export default class AI extends Microservice {
   private _apiKey: string;
   private _threads: Map<string, Thread>;
   private _assistantID?: string;

   public client: OpenAI;
   public isAssistant: boolean;
   public model: string;

   /**
    * Constructs an AI instance.
    * @param setup - Configuration object containing API key, assistant ID, and model.
    */
   constructor(setup: AISetup) {
      super(setup)
      const { apiKey, assistantID, model = 'gpt-4.1-nano' } = setup || {};

      this._threads = new Map();
      this._apiKey = apiKey;
      this._assistantID = assistantID;

      this.model = model;
      this.isAssistant = Boolean(this._assistantID);
      this.client = new OpenAI({ apiKey: this._apiKey });
   }

   /**
    * Returns the OpenAI responses client.
    */
   get responses() {
      return this.client.responses;
   }

   /**
    * Returns the OpenAI assistants client (beta).
    */
   get assistants() {
      return this.client.beta.assistants;
   }

   /**
    * Returns the OpenAI threads client (beta).
    */
   get threads() {
      return this.client.beta.threads;
   }

   /**
    * Retrieves a thread by its ID from the internal thread map.
    * @param id - The thread ID.
    * @returns The Thread instance or undefined if not found.
    */
   getThread(id: string): Thread | undefined {
      return this._threads.get(id);
   }

   /**
    * Stores a thread in the internal thread map.
    * @param id - The thread ID.
    * @param value - The Thread instance.
    */
   setThread(id: string, value: Thread) {
      if (!id || !value) {
         return;
      }

      this._threads.set(id, value);
   }

   /**
    * Loads a file as a UTF-8 string, normalizing the file path.
    * @param filePath - The path to the file.
    * @returns The file contents as a string.
    */
   loadFileString(filePath: string) {
      const normalizedPath = path.normalize(filePath);
      return fs.readFileSync(normalizedPath, 'utf-8');
   }

   /**
    * Creates a new OpenAI thread and stores it in the internal map.
    * @param id - The thread ID to associate with the new thread.
    * @returns The created Thread instance.
    */
   async createThread(id: string): Promise<Thread> {
      const thread: Thread = await this.threads.create();

      this.setThread(id, thread);
      return thread;
   }

   /**
    * Creates a response from the OpenAI API using the provided input and options.
    * @param input - The input prompt(s) for the model.
    * @param opt - Optional configuration for the response.
    * @returns The generated output text.
    */
   async createResponse(input: string | ResponseInput[], opt?: CreateResponseOpt) {
      const { model = this.model } = Object(opt);

      try {
         const response = await this.responses.create({
            model,
            input: input as any,
            ...opt
         });

         return response.output_text;
      } catch (err) {
         throw ErrorModel.toError('Error caught during GPT response creating.');
      }
   }

   /**
    * Sends a message to an assistant thread and retrieves the assistant's reply.
    * Handles thread creation, message sending, polling for completion, and extracting the reply.
    * @param threadID - The ID of the thread to use or create.
    * @param message - The user's message to send.
    * @returns An object containing the thread ID and the assistant's reply text, or undefined if not found.
    * @throws Error if assistantID is not provided or if an error occurs during processing.
    */
   async threadMessage(threadID: string = '', message: string) {
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

         return {
            threadID: thread.id,
            output: contentBlock.text.value
         };
      } catch (err) {
         throw err;
      }
   }
}
