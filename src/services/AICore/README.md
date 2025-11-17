# AICore Service

The AICore service is a comprehensive AI chat management system built on top of the OpenAI API. It provides a structured way to create, manage, and interact with AI chat sessions using OpenAI's response models.

## Overview

AICore extends the `Microservice` class and serves as the main entry point for AI-powered conversations. It manages multiple chat sessions, handles OpenAI client configuration, and provides a high-level interface for AI interactions.

## Architecture

```
AICore/
├── AICore.ts              # Main service class
├── AICore.types.ts        # Type definitions
├── AICoreChat.ts          # Chat session management
├── AIAgent.ts             # AI Agent management
├── AICoreHelpers.ts       # Utility functions
├── ErrorAICore.ts         # Custom error handling
└── models/
    ├── AIHistory.ts           # Chat history collection
    ├── AIHistoryItem.ts       # Chat history item model
    ├── AICoreInputCell.ts     # Input cell model
    ├── AICoreTurn.ts          # Base turn class
    ├── AIChatTurn.ts          # Chat response handling
    ├── AIAgentTurn.ts         # Agent response handling
    ├── AgentInputItemModel.ts # Agent input transformation
    ├── AgentOutputItemModel.ts # Agent output transformation
    ├── AgentStore.ts          # Agent collection
    └── ResponseInputItemModel.ts # Response input transformation
```

## Classes

### AICore

The main service class that manages OpenAI client configuration and chat sessions.

#### Constructor
```typescript
constructor(setup: AICoreSetup = {})
```

**Parameters:**
- `setup.apiKey` (optional): OpenAI API key
- `setup.model` (optional): AI model to use (default from app.config)
- `setup.modelSettings` (optional): Model settings configuration

#### Properties
- `client`: OpenAI client instance
- `apiKey`: The configured API key
- `model`: The AI model being used
- `modelSettings`: Model settings configuration

#### Methods

##### `getChat(id: number): AICoreChat | undefined`
Retrieves a chat session by ID.

##### `setChat(chat: AICoreChat): void`
Stores a chat session in the internal map.

##### `startChat(options: AICoreChatOptions): Promise<AICoreChat>`
Creates and initializes a new chat session.

### AICoreChat

Manages individual chat sessions, including history and system prompts.

#### Constructor
```typescript
constructor(aiCore: AICore, options: AICoreChatOptions)
```

**Parameters:**
- `aiCore`: Parent AICore instance
- `options.id` (optional): Chat session ID
- `options.label` (optional): Human-readable label
- `options.model` (optional): AI model for this chat
- `options.modelSettings` (optional): Model settings for this chat
- `options.instructions` (optional): System instructions text
- `options.instructionsFile` (optional): Instructions file content
- `options.instructionsPath` (optional): Path to markdown file containing instructions
- `options.history` (optional): Previous chat history (array of ResponseOutputMessage | AICoreInputCell)
- `options.agents` (optional): Array of AIAgent instances for this chat

#### Properties
- `id`: Unique chat identifier
- `label`: Human-readable chat label
- `model`: AI model for this chat
- `modelSettings`: Model settings for this chat
- `isInit`: Initialization status
- `history`: Array of AIHistoryItem instances
- `agents`: Array of AIAgent instances
- `instructions`: Combined instructions from all sources
- `instructionsFile`: Instructions loaded from file
- `instructionsPath`: Path to instructions file

#### Methods

##### `response(model?: AIModels, systemPrompt?: string): AIChatTurn`
Creates a new chat response builder for this chat.

##### `getHistoryItem(id: string): AIHistoryItem | undefined`
Retrieves a specific history item by ID.

##### `setHistoryItem(item: AICoreInputCell | ResponseOutputMessage | AgentOutputItemModel): AIHistoryItem`
Stores a history item and returns the created AIHistoryItem.

##### `setHistoryBulk(items: (AICoreInputCell | ResponseOutputMessage | AgentOutputItemModel)[]): void`
Adds multiple items to chat history.

##### `getAgent(name: string): AIAgent | undefined`
Retrieves an agent by name.

##### `setAgent(agentSetup: AIAgentSetup | AIAgent): AIAgent`
Adds an agent to the chat.

##### `setAgentBulk(agents: (AIAgentSetup | AIAgent)[]): AIAgent[]`
Adds multiple agents to the chat.

##### `start(): Promise<AICoreChat>`
Initializes the chat session and saves it to the database.

### AIChatTurn

Handles chat response creation and streaming for chat interactions.

#### Constructor
```typescript
constructor(setup: AIChatTurnSetup, aiChat?: AICoreChat)
```

**Parameters:**
- `setup.model` (optional): AI model for this turn
- `setup.systemPrompt` (optional): System prompt for this turn
- `aiChat` (optional): Parent AICoreChat instance

#### Methods

##### `options(options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming): AIChatTurn`
Sets OpenAI API options for the response.

##### `addCell(role: CellRole, textContent?: string): AICoreInputCell`
Adds an input cell to the turn.

##### `create(): Promise<OpenAIResponseType>`
Creates a non-streaming response and updates chat history.

##### `stream(callbacks?: AICoreResponseStreamCallbacks): Promise<Stream>`
Creates a streaming response with optional callbacks.

### AICoreTurn

Base class for turn-based interactions (chat and agent).

#### Properties
- `parent`: Parent AICoreChat or AIAgent instance
- `input`: Array of AICoreInputCell instances
- `model`: AI model for this turn
- `instructions`: Turn-specific instructions
- `fullInstructions`: Combined parent and turn instructions

#### Methods

##### `setModel(model?: AIModels): this`
Sets the AI model for this turn.

##### `addInstructions(instructions: string): AICoreInputCell`
Adds instructions to the turn and creates a system cell.

##### `addCell(role: CellRole, textContent?: string): AICoreInputCell`
Adds an input cell to the turn.

### AICoreInputCell

Represents an input message in the conversation.

#### Constructor
```typescript
constructor(aiResult: AIAgentTurn | AIChatTurn | AICoreTurn, setup: AICoreInputCellSetup)
```

#### Properties
- `id`: Optional cell identifier
- `type`: Cell type (default: 'message')
- `role`: Cell role ('user', 'assistant', 'system')
- `content`: Array of message content items

#### Methods

##### `toAgentInputItem(): AgentInputItem`
Converts the cell to an agent input item format.

##### `toResponseInputItem(): ResponseInputItem`
Converts the cell to a response input item format.

##### `addText(content: string): AICoreInputCell`
Adds text content to the cell.

##### `attachFileByID(fileId: string): AICoreInputCell`
Attaches a file by OpenAI file ID.

##### `attachFileData(filePath: string): Promise<AICoreInputCell>`
Attaches a file by reading from filesystem.

##### `attachImage(imageUrl: string, detail?: 'auto' | 'low' | 'high'): Promise<void>`
Attaches an image by URL or file path.

### AIHistoryItem

Represents a single item in the chat history.

#### Constructor
```typescript
constructor(setup: AICoreInputCell | ResponseOutputMessage | AgentOutputItemModel | AgentFunctionCall)
```

#### Properties
- `id`: Unique history item identifier
- `createdAt`: ISO timestamp of creation
- `role`: Message role
- `content`: Message content or agent output
- `type`: Optional type ('message' or 'function_call')
- `isToolCall`: Boolean indicating if this is a tool call
- Additional properties for function calls: `callId`, `name`, `providerData`, `status`, `arguments`

#### Methods

##### `toAgentInputItem(): AgentInputItem`
Converts to agent input item format.

##### `toResponseInputItem(): ResponseInputItem`
Converts to response input item format.

### AgentOutputItemModel

Represents an AI agent's output message.

#### Constructor
```typescript
constructor(content: AIAgentOutputContent, status?: 'in_progress' | 'completed' | 'incomplete', options?: { id?: string; type?: 'message' })
```

#### Properties
- `role`: Always 'assistant'
- `status`: Completion status
- `content`: Agent output content
- `id`: Optional identifier
- `type`: Optional type

#### Methods

##### `toAgentOutputItem(): AgentOutputItem`
Converts to OpenAI agent output item format.

##### `static fromText(text: string, status?): AgentOutputItemModel`
Static factory method to create from text content.

##### `static fromContent(content: AIAgentOutputContent, status?): AgentOutputItemModel`
Static factory method to create from array content.

## Usage Examples

### Basic Chat Session

```typescript
import AICore from './AICore';

// Initialize AICore
const aiCore = new AICore({
  apiKey: 'your-openai-api-key',
  model: 'gpt-4o'
});

// Start a new chat
const chat = await aiCore.startChat({
  label: 'My Chat Session',
  instructions: 'You are a helpful assistant.'
});

// Create a response
const response = chat.response()
  .addCell('user', 'Hello, how are you?');

// Get non-streaming response
const result = await response.create();
console.log(result);
```

### Streaming Response

```typescript
const response = chat.response()
  .addCell('user', 'Tell me a story');

const stream = await response.stream({
  onOutputTextDelta: (chunk) => {
    console.log('New text:', chunk.delta);
  },
  onComplete: (event) => {
    console.log('Response completed');
  },
  onError: (error) => {
    console.error('Stream error:', error);
  }
});
```

### File Attachment

```typescript
const response = chat.response()
  .addCell('user', 'Analyze this document');

// Attach file by ID
response.addCell('user').attachFileByID('file-xyz123');

// Or attach file by path (async)
await response.addCell('user').attachFileData('path/to/document.pdf');

const result = await response.create();
```

### Instructions from File

```typescript
const chat = await aiCore.startChat({
  label: 'Document Assistant',
  instructionsPath: 'prompts/document-analysis.md'
});
```

### Using AI Agents

```typescript
import AIAgent from './AIAgent';

// Create an agent with tools
const assistant = new AIAgent({
  name: 'code-assistant',
  label: 'Code Assistant',
  model: 'gpt-4o',
  instructions: 'You are a helpful coding assistant.',
  tools: [
    {
      name: 'search_code',
      description: 'Search through code repository',
      parameters: z.object({
        query: z.string()
      }),
      execute: async (params) => {
        // Tool implementation
        return searchResults;
      }
    }
  ]
});

// Add agent to chat
const chat = await aiCore.startChat({
  label: 'Coding Session',
  agents: [assistant]
});

// Use agent turn for specialized responses
const agentResponse = assistant.turn()
  .addCell('user', 'Find all TypeScript functions')
  .create();
```

## Error Handling

The service uses a custom `ErrorAICore` class for error handling. All errors include:
- `message`: Error description
- `code`: Specific error code for programmatic handling
- `error`: Boolean flag (always true)

Common error codes:
- `AICORE_INVALID_CHAT_INSTANCE`: Invalid chat instance provided
- `AICORE_INVALID_CHAT_ID`: Chat ID is missing or invalid
- `AICORE_START_CHAT_ERROR`: Failed to start chat session
- `AICORE_CHAT_RESPONSE_CREATE_ERROR`: Failed to create response
- `AICORE_CHAT_RESPONSE_STREAM_ERROR`: Failed to create streaming response

## Types

### Key Types

```typescript
type AIModels = AllModels; // OpenAI model types
type CellRole = 'user' | 'assistant' | 'system' | 'developer';

interface AICoreSetup extends MicroserviceSetup {
  apiKey?: string;
  model?: AIModels;
}

interface AICoreChatOptions {
  id?: number;
  label?: string;
  model?: AIModels;
  modelSettings?: ModelSettings;
  instructions?: string;
  instructionsFile?: string;
  instructionsPath?: string;
  history?: (ResponseOutputMessage | AICoreInputCell)[];
  agents?: AIAgent[];
}

interface AICoreInputCellSetup {
  id?: string;
  type?: string;
  role: CellRole;
  textContent?: string;
  content?: CellMessageContent;
}

interface AIAgentSetup<TContext = any, TOutput = unknown> {
  apiKey?: string;
  name: string;
  label?: string;
  model?: AIModels;
  instructions?: string;
  instructionsFile?: string;
  instructionsPath?: string;
  handoffDescription?: string;
  handoffOutputTypeWarningEnabled?: boolean;
  handoffs?: (Agent<TContext, AgentOutputType<TOutput>> | Handoff<any, AgentOutputType<TOutput>>)[];
  inputGuardrails?: InputGuardrail[];
  mcpServers?: MCPServer[];
  modelSettings?: ModelSettings;
  outputGuardrails?: OutputGuardrail<"text">[];
  outputType?: AgentOutputType<TOutput>;
  prompt?: (runContext: RunContext<TContext>, agent: Agent<TContext, AgentOutputType<TOutput>>) => Promise<ResponsePrompt> | ResponsePrompt;
  resetToolChoice?: boolean;
  tools?: Tool<TContext>[];
  toolUseBehavior?: ToolUseBehavior;
}
```

## Dependencies

- `openai`: OpenAI JavaScript SDK
- `@openai/agents`: OpenAI Agents SDK for advanced agent features
- `ioredis`: Redis client (inherited from Microservice)
- `fs`: File system operations
- `path`: Path utilities
- `crypto`: Cryptographic utilities (inherited from Microservice)
- `zod/v4`: Schema validation for tool parameters

## Configuration

The service inherits microservice configuration from the parent `Microservice` class, including:
- Redis connectivity for inter-service communication
- Event-driven architecture support
- Service discovery and registration

## Best Practices

1. **Always handle errors**: Wrap AICore operations in try-catch blocks
2. **Manage chat history**: Use the built-in AIHistory management for context
3. **Use streaming for long responses**: Implement streaming for better user experience
4. **Instructions management**: Use external markdown files for complex instructions via `instructionsPath`
5. **File attachments**: Validate file paths and handle file read errors; use async/await for `attachFileData`
6. **Resource cleanup**: Properly manage chat sessions to avoid memory leaks
7. **Agent organization**: Use agents for specialized tasks and tool execution
8. **Model settings**: Configure model-specific settings via `modelSettings` for fine-tuned control

## Performance Considerations

- Chat history is stored in memory using AIHistory (extends Map); consider implementing persistence for large applications
- History is automatically persisted to database via AICoreChat.start()
- File attachments are loaded into memory; be mindful of file sizes
- Streaming responses are more efficient for long AI outputs
- Use appropriate AI models based on use case requirements
- Agent tools execute synchronously; design for performance
- Model settings can optimize token usage and response quality

## Future Enhancements

- Enhanced database persistence for chat history with full CRUD operations
- Support for more file types and multimodal content
- Advanced conversation management features
- Integration with other AI providers
- Conversation analytics and metrics
- Advanced agent orchestration and handoff patterns
- Improved tool execution pipeline
- Agent-to-agent communication patterns