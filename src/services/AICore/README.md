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
├── AICoreResponse.ts      # Response handling and streaming
├── AICoreHelpers.ts       # Utility functions
├── ErrorAICore.ts         # Custom error handling
└── models/
    ├── AIChatHistoryItem.ts   # Chat history item model
    ├── AICoreInputCell.ts     # Input cell model
    └── AICoreOutputCell.ts    # Output cell model
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
- `setup.model` (optional): AI model to use (default: 'gpt-4.1-mini')

#### Properties
- `client`: OpenAI client instance
- `apiKey`: The configured API key
- `model`: The AI model being used

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
- `options.systemMessage` (optional): System prompt text
- `options.smPath` (optional): Path to markdown file containing system prompt
- `options.history` (optional): Previous chat history

#### Properties
- `id`: Unique chat identifier
- `label`: Human-readable chat label
- `model`: AI model for this chat
- `systemPrompt`: System prompt content
- `isInitialized`: Initialization status
- `history`: Array of chat history items

#### Methods

##### `response(model?: AIModels, systemPrompt?: string): AICoreResponse`
Creates a new response builder for this chat.

##### `getHistoryItem(id: string): AIChatHistoryItem | null`
Retrieves a specific history item.

##### `setHistoryItem(item: AIChatHistoryItem): AIChatHistoryItem | null`
Stores a history item.

##### `newHistoryItem(cell: AICoreOutputCell | AICoreInputCell): void`
Adds a new item to chat history.

##### `delHistory(id: string): boolean`
Removes a history item.

##### `start(): Promise<AICoreChat>`
Initializes the chat session.

### AICoreResponse

Handles response creation and streaming for chat interactions.

#### Constructor
```typescript
constructor(aiChat: AICoreChat, model: AIModels, systemPrompt?: string)
```

#### Methods

##### `options(options: ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming): AICoreResponse`
Sets OpenAI API options.

##### `model(model: AIModels): AICoreResponse`
Sets the AI model for this response.

##### `systemPrompt(systemPrompt: string): AICoreResponse`
Sets the system prompt for this response.

##### `addCell(role: CellRole, textContent?: string): AICoreInputCell`
Adds an input cell to the response.

##### `create(): Promise<OpenAIResponseType>`
Creates a non-streaming response.

##### `stream(callbacks?: AICoreResponseStreamCallbacks): Promise<Stream>`
Creates a streaming response with optional callbacks.

### AICoreInputCell

Represents an input message in the conversation.

#### Methods

##### `addText(content: string): AICoreInputCell`
Adds text content to the cell.

##### `attachFileByID(fileId: string): AICoreInputCell`
Attaches a file by OpenAI file ID.

##### `attachFileData(filePath: string): AICoreInputCell`
Attaches a file by reading from filesystem.

### AICoreOutputCell

Represents an AI-generated response message.

### AIChatHistoryItem

Represents a single item in the chat history, can be either input or output.

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
  systemMessage: 'You are a helpful assistant.'
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
  .addCell('user', 'Analyze this document')
  .attachFileData('path/to/document.pdf');

const result = await response.create();
```

### System Prompt from File

```typescript
const chat = await aiCore.startChat({
  label: 'Document Assistant',
  smPath: 'prompts/document-analysis.md'
});
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
  systemMessage?: string;
  smPath?: string;
  history?: (AICoreOutputCell | AICoreInputCell)[];
}
```

## Dependencies

- `openai`: OpenAI JavaScript SDK
- `ioredis`: Redis client (inherited from Microservice)
- `fs`: File system operations
- `path`: Path utilities
- `crypto`: Cryptographic utilities (inherited from Microservice)

## Configuration

The service inherits microservice configuration from the parent `Microservice` class, including:
- Redis connectivity for inter-service communication
- Event-driven architecture support
- Service discovery and registration

## Best Practices

1. **Always handle errors**: Wrap AICore operations in try-catch blocks
2. **Manage chat history**: Use the built-in history management for context
3. **Use streaming for long responses**: Implement streaming for better user experience
4. **System prompts**: Use external markdown files for complex system prompts
5. **File attachments**: Validate file paths and handle file read errors
6. **Resource cleanup**: Properly manage chat sessions to avoid memory leaks

## Performance Considerations

- Chat history is stored in memory; consider implementing persistence for large applications
- File attachments are loaded into memory; be mindful of file sizes
- Streaming responses are more efficient for long AI outputs
- Use appropriate AI models based on use case requirements

## Future Enhancements

- Database persistence for chat history
- Support for more file types
- Advanced conversation management features
- Integration with other AI providers
- Conversation analytics and metrics