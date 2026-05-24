import { Agent, AgentOutputType, Handoff, InputGuardrail, MCPServer, ModelSettings, OutputGuardrail, RunContext, Tool, ToolUseBehavior } from '@openai/agents';
import { AIAgentSetup, AIAgentTurnSetup, AIModels } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AIAgentTurn from './models/AIAgentTurn';
import AIHistory from './models/AIHistory';
import AIHistoryItem from './models/AIHistoryItem';
import AICoreChat from './AICoreChat';
import { ResponsePrompt } from 'openai/resources/responses/responses';
import AICoreHelpers from './AICoreHelpers';
import { defaultAIModel } from '../../settings';

export default class AIAgent<TContext = any, TOutput = unknown> {
   private _aiChat?: AICoreChat;
   private _agent: Agent<TContext, AgentOutputType<TOutput>>;
   private _history: AIHistory<TContext>;
   private _instructions?: string;
   private _instructionsFile?: string;
   private _instructionsPath?: string;

   public name: string;
   public label: string;
   public model: AIModels;
   public handoffDescription?: string;
   public handoffOutputTypeWarningEnabled: boolean;
   public handoffs?: (Agent<TContext, AgentOutputType<TOutput>> | Handoff<TContext, "text">)[];
   public inputGuardrails?: InputGuardrail[];
   public mcpServers?: MCPServer[];
   public modelSettings?: ModelSettings;
   public outputGuardrails?: OutputGuardrail<"text">[];
   public outputType?: AgentOutputType<TOutput>;
   public resetToolChoice: boolean;
   public tools?: Tool<TContext>[];
   public toolUseBehavior?: ToolUseBehavior;
   public instructionsFilePath?: string;
   public prompt?: (runContext: RunContext<TContext>, agent: Agent<TContext, AgentOutputType<TOutput>>) => Promise<ResponsePrompt> | ResponsePrompt;

   constructor(setup: AIAgentSetup<TContext, AgentOutputType<TOutput>>, aiChat?: AICoreChat) {
      const {
         apiKey,
         name,
         label = name,
         model = defaultAIModel,
         modelSettings,
         instructions = '',
         instructionsFile,
         instructionsPath,
         handoffDescription,
         handoffOutputTypeWarningEnabled = true,
         handoffs = [],
         inputGuardrails,
         mcpServers,
         outputGuardrails,
         outputType,
         resetToolChoice = false,
         tools = [],
         toolUseBehavior,
         prompt
      } = setup || {};

      if (!name || !name.trim().length || typeof name !== 'string') {
         throw new ErrorAICore(`It's required to provide a valid name to create an AI Agent!`, 'ERROR_INVALID_AGENT_NAME');
      }

      if (apiKey && (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY !== apiKey)) {
         process.env.OPENAI_API_KEY = apiKey;
      }

      this.name = name;
      this.label = label;
      this.model = model;
      this.handoffDescription = handoffDescription;
      this.handoffOutputTypeWarningEnabled = handoffOutputTypeWarningEnabled;
      this.handoffs = handoffs;
      this.inputGuardrails = inputGuardrails;
      this.mcpServers = mcpServers;
      this.outputGuardrails = outputGuardrails;
      this.outputType = outputType;
      this.resetToolChoice = resetToolChoice;
      this.tools = tools;
      this.toolUseBehavior = toolUseBehavior;
      this.prompt = prompt;
      
      // Private
      this._aiChat = aiChat;
      this._history = new AIHistory<TContext>();
      this._instructions = instructions;
      this._instructionsFile = instructionsFile;
      
      if (instructionsPath) {
         this._instructionsPath = instructionsPath;
         this._instructionsFile = AICoreHelpers.loadMarkdown(instructionsPath);
      }

      const hasAnyTooling = Boolean(
         (tools && tools.length > 0)
         || (handoffs && handoffs.length > 0)
         || (mcpServers && mcpServers.length > 0)
      );

      const effectiveModelSettings: ModelSettings = hasAnyTooling
         ? (modelSettings || {})
         : {
            ...(modelSettings || {}),
            parallelToolCalls: false,
         };

      this.modelSettings = effectiveModelSettings;

      this._agent = new Agent<TContext, AgentOutputType<TOutput>>({
         name,
         model,
         instructions: (runContext) => {
            const ctx = runContext?.context;
            const contextStr = ctx && Object.keys(ctx).length
               ? `\n\n<context>\n${JSON.stringify(ctx, null, 2)}\n</context>`
               : '';
            return this.instructions + contextStr;
         },
         handoffDescription,
         handoffOutputTypeWarningEnabled,
         handoffs,
         inputGuardrails,
         mcpServers,
         modelSettings: effectiveModelSettings,
         outputGuardrails,
         outputType,
         resetToolChoice,
         tools,
         toolUseBehavior,
      });
   }

   get aiChat(): AICoreChat | undefined {
      return this._aiChat;
   }

   get agent(): Agent<TContext, AgentOutputType<TOutput>> {
      return this._agent;
   }

   get history(): AIHistoryItem<TContext>[] {
      if (this.aiChat) {
         return this.aiChat.history;
      } else {
         return Array.from(this._history.values());
      }
   }

   get instructions() {
      return [this.aiChat?.instructions, this._instructions, this._instructionsFile].filter(Boolean).join('\n---\n');
   }
   
   get instructionsPath() {
      return this._instructionsPath;
   }

   get setHistoryItem() {
      if (this.aiChat) {
         return this.aiChat.setHistoryItem;
      } else {
         return this._history.setItem.bind(this._history);
      }
   }

   get setHistoryBulk() {
      if (this.aiChat) {
         return this.aiChat.setHistoryBulk;
      } else {
         return this._history.setBulk.bind(this._history);
      }
   }

   get getHistoryItem() {
      if (this.aiChat) {
         return this.aiChat.getHistoryItem;
      } else {
         return this._history.getItem.bind(this._history);
      }
   }

   get asTool(): typeof this._agent.asTool {
      return this._agent.asTool.bind(this._agent);
   }

   setChat(aiChat: AICoreChat): this {
      this._aiChat = aiChat;
      return this;
   }

   turn(setup?: AIAgentTurnSetup): AIAgentTurn<TContext> {
      return new AIAgentTurn<TContext>(setup, this);
   }

   addHandoff(handoff: AIAgent): this {
      if (!Array.isArray(this.handoffs)) {
         this.handoffs = [];
      }

      this.handoffs.push(handoff.agent);
      return this;
   }
}
