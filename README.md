# Felipe Ramos API - Microservices Backend (v1.7.0)

A sophisticated microservices-based backend system powering Felipe Ramos' interactive portfolio and AI-powered career management platform. Now featuring the **OpenAI Agents SDK integration** for advanced AI orchestration, comprehensive cover letter generation, job opportunity management, AI-powered CV customization, LinkedIn job data extraction, and enhanced career application workflows. Built with Node.js, TypeScript, and a modular architecture supporting real-time communication, agent-based AI assistance, and comprehensive automated career management workflows.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 🚀 Features

### New in v1.7.0 - OpenAI Agents SDK Integration
- **🤖 AICore Service**: Complete AI service rewrite using OpenAI Agents SDK (`@openai/agents`) for advanced AI orchestration
- **🎯 Agent-Based Architecture**: Multi-agent system with specialized agents for CV generation, cover letters, and career assistance
- **🔄 Dual Response Patterns**: Support for both direct chat responses and agent-based execution with tool integration
- **💬 Enhanced Chat Management**: Persistent chat sessions with intelligent history tracking and context management
- **🛠️ Tool Integration**: Extensible tool system for agents with function calling and structured outputs
- **🔗 Agent Handoffs**: Seamless agent-to-agent task delegation for complex workflows
- **📝 Instruction System**: Flexible instruction loading from text or markdown files for agent customization
- **🗄️ Database Integration**: Chat persistence with new `chats` table in `messages_schema`
- **🎨 Type-Safe API**: Comprehensive TypeScript coverage with generic type support for contexts and outputs
- **📚 Comprehensive Documentation**: Extensive README with usage examples, patterns, and best practices

### New in v1.6.0 - Cover Letter & Job Opportunity Management
- **📝 AI-Powered Cover Letter Generation**: Complete cover letter creation system with OpenAI integration for personalized, job-specific cover letters
- **💼 Job Opportunity Management**: Comprehensive CRUD operations for job opportunities with LinkedIn integration and automated data extraction
- **📊 Enhanced LinkedIn Scraping**: Advanced job data extraction including location, seniority, employment type, and detailed job descriptions
- **🎯 CV Summary Generation**: AI-powered CV summary generation tailored to specific job opportunities and requirements
- **📄 Automated PDF Generation**: Real-time PDF creation for cover letters with file management and cleanup
- **🔄 Real-time Status Updates**: Socket-based status broadcasting for cover letter generation and job opportunity processing
- **🗄️ Advanced Database Schema**: New schemas for opportunities, letters, and comments with comprehensive relationship mapping
- **🔧 RESTful API Standardization**: Improved HTTP method standards and enhanced error handling across all endpoints

### Previous Features - v1.5.0 - AI-Powered CV Customization & LinkedIn Integration
- **🤖 AI CV Summary Generation**: Dedicated OpenAI assistant for intelligent CV summary creation and customization
- **💼 LinkedIn Job Data Extraction**: Automated extraction of job titles, company information, and detailed job descriptions from LinkedIn postings
- **⭐ CV Favorites System**: Enhanced CV management with favoriting capabilities and improved filtering options
- **🔄 Real-time CV Generation**: Socket.IO namespaces for real-time AI-powered CV customization workflows
- **🌐 Enhanced Virtual Browser**: Advanced web scraping capabilities with modal handling and dynamic content extraction
- **📊 Intelligent CV Matching**: AI-powered analysis to match CV content with specific job requirements
- **🎯 ATS-Optimized Output**: AI-generated summaries optimized for Applicant Tracking Systems
- **🔧 Custom Prompt Support**: Flexible AI prompt system for tailored CV summary generation

### Previous Features - v1.4.0 - ATS Optimization & Extended CV Management
- **🗣️ Language Management**: Complete CRUD operations for language skills with proficiency levels
- **🎓 Education Management**: Full educational background tracking with degrees, institutions, and academic achievements
- **📋 Enhanced CV Model**: Extended curriculum vitae support with integrated languages and educations
- **🔄 Extended Database Events**: Event-driven architecture updates for language and education changes
- **🌐 Improved Multi-language Support**: Enhanced internationalization with language proficiency tracking
- **📊 ATS-Ready Data Structure**: Optimized data models for Applicant Tracking System compatibility
- **🔗 Relational Data Integration**: Seamless integration between CV, languages, and educations entities

### Previous Features - v1.2.0 & v1.3.0 - Admin Dashboard & Database Management
- **🔐 JWT Authentication**: Secure token-based authentication with role-based access control
- **👥 User Management**: Master user creation and admin user management system
- **📊 Skills Management**: Complete CRUD operations for skills with multi-language support
- **🏢 Company Management**: Full company profile management with industry categorization
- **💼 Experience Management**: Comprehensive work experience tracking with detailed descriptions
- **📄 CV Management**: Complete curriculum vitae creation and management system
- **🤖 VirtualBrowser Service**: Headless browser automation for PDF generation
- **📋 PDF Generation**: Automated CV PDF creation with multi-language support
- **🔄 Database Events**: Event-driven architecture for automatic PDF updates
- **🌐 Multi-language Support**: Language sets for internationalization (English/Spanish/etc.)
- **🔒 Role-based Authorization**: Master, Admin, and User role hierarchy with route protection
- **📝 Public API Endpoints**: Read-only public endpoints for portfolio data display

### Core Features
- **AI-Powered Career Platform**: Comprehensive OpenAI GPT integration for intelligent career-related conversations, CV customization, and cover letter generation
- **Cover Letter Management**: Complete cover letter creation, management, and PDF generation system with AI-powered personalization
- **Job Opportunity Tracking**: Full job opportunity lifecycle management with LinkedIn integration and automated data extraction
- **AI CV Customization**: Specialized AI assistant for tailored CV summary generation based on specific job requirements
- **Real-time Communication**: Socket.IO server with namespace and room management for cover letters, opportunities, and CV chat workflows
- **LinkedIn Integration**: Advanced job data extraction from LinkedIn postings with intelligent content parsing and modal handling
- **Microservices Architecture**: Modular, scalable service-oriented design with enhanced database schemas
- **Slack Integration**: Automated Slack bot for notifications and interactions
- **Redis Cache Layer**: High-performance caching and session management
- **PostgreSQL Database**: Robust relational data storage with comprehensive schema management for career data
- **Docker Support**: Containerized deployment with Docker Compose and shared storage volumes
- **SSL/HTTPS Support**: Production-ready security configuration
- **Cluster Management**: Multi-process support for high availability
- **RESTful APIs**: Well-structured API endpoints with comprehensive documentation and standardized HTTP methods

## 🏗️ Architecture

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **AICore Service** | - | OpenAI Agents SDK integration with multi-agent orchestration |
| **Socket Server** | 5000 | Real-time WebSocket communication |
| **API Server** | 3001 | RESTful API endpoints |
| **Slack Service** | 4000 | Slack bot and webhook handling |
| **VirtualBrowser Service** | - | Headless browser automation for PDF generation |

### Core Services

- **🤖 AICore Service**: OpenAI Agents SDK with multi-agent orchestration, chat management, and tool integration
- **🔌 Socket Server**: Real-time communication with namespaces
- **🛡️ Server API**: HTTP/HTTPS server with CORS and security
- **💾 Redis DB**: Caching, sessions, and pub/sub messaging
- **🗄️ Database**: PostgreSQL with schema management
- **🏗️ Cluster Manager**: Process management and scaling
- **🖥️ VirtualBrowser**: Headless browser automation service for PDF generation and web scraping

## 📦 Tech Stack

### Backend Core
- **Node.js 20+** - JavaScript runtime
- **TypeScript 5+** - Type-safe development
- **Express 5** - Web application framework
- **Socket.IO 4.8+** - Real-time bidirectional communication

### Authentication & Security
- **JWT (jsonwebtoken 9.0+)** - Secure token-based authentication
- **bcrypt 6.0+** - Password hashing and validation
- **cookie-parser 1.4+** - HTTP cookie parsing
- **express-session 1.18+** - Session management

### AI & Integration
- **OpenAI Agents SDK (@openai/agents 0.1.9+)** - Official OpenAI Agents framework for advanced AI orchestration
- **OpenAI API 5.23+** - Latest OpenAI SDK with response streaming and function calling
- **Zod 3.25+** - Schema validation for agent tool definitions
- **Slack Bolt 4.4+** - Slack app framework
- **Puppeteer 24.15+** - Headless browser automation for PDF generation, cover letter creation, and LinkedIn data extraction

### Database & Caching
- **PostgreSQL 8.16+** - Primary database with full schema management
- **Redis (ioredis 5.6+)** - Caching and session store

### Development & Deployment
- **Docker & Docker Compose** - Containerization with health checks
- **Nodemon** - Development auto-reload
- **ts-node** - TypeScript execution
- **Rimraf** - Clean build directories

## 📁 Project Structure

```
feliperamos-api/
├── src/
│   ├── containers/              # Service containers
│   │   ├── ai.service.ts       # AICore service with OpenAI Agents SDK
│   │   ├── api-server.service.ts # REST API server
│   │   ├── slack.service.ts    # Slack integration
│   │   ├── socket-server.service.ts # Socket.IO server
│   │   ├── virtual-browser.service.ts # VirtualBrowser service
│   │   ├── namespaces/         # Socket namespaces
│   │   │   ├── cv-chat/        # CV chat namespace and events
│   │   │   ├── cover-letter/   # Cover letter generation namespace
│   │   │   └── opportunities/  # Job opportunities namespace
│   │   └── routes/             # Inter-service communication routes
│   │       ├── ai/             # AI service event endpoints
│   │       │   └── get-chat.route.ts # Chat retrieval endpoint
│   │       └── virtual-browser/ # VirtualBrowser event routes
│   ├── database/               # Database layer
│   │   ├── index.ts           # Database initialization
│   │   ├── models/            # Data models & ORM
│   │   │   ├── users_schema/  # User management models
│   │   │   ├── skills_schema/ # Skills management models
│   │   │   ├── companies_schema/ # Company management models
│   │   │   ├── languages_schema/ # Language skills management models
│   │   │   ├── educations_schema/ # Education management models
│   │   │   ├── curriculums_schema/ # CV/Resume management models
│   │   │   ├── experiences_schema/ # Experience management models
│   │   │   ├── opportunities_schema/ # Job opportunities management models
│   │   │   ├── letters_schema/ # Cover letters management models
│   │   │   └── messages_schema/ # Messages and chat system models
│   │   │       ├── Chat/      # Chat session model with database integration
│   │   │       └── Comment/   # Comment model
│   │   ├── schemas/           # Database schema definitions
│   │   └── tables/            # Table structure definitions
│   ├── routes/                # API endpoint implementations
│   │   ├── auth/              # Authentication routes
│   │   ├── skill/             # Skills CRUD operations
│   │   ├── company/           # Company CRUD operations
│   │   ├── language/          # Language skills CRUD operations
│   │   ├── education/         # Education CRUD operations
│   │   ├── curriculum/        # CV/Resume CRUD operations
│   │   ├── experience/        # Experience CRUD operations
│   │   ├── opportunity/       # Job opportunities CRUD operations
│   │   ├── cover-letter/      # Cover letters CRUD operations
│   │   ├── user/              # User management routes
│   │   └── health.route.ts    # Health check endpoint
│   ├── services/              # Core service classes
│   │   ├── AI/                # Legacy OpenAI integration (deprecated)
│   │   ├── AICore/            # New OpenAI Agents SDK integration
│   │   │   ├── AICore.ts      # Main AICore service class
│   │   │   ├── AICoreChat.ts  # Chat session management
│   │   │   ├── AIAgent.ts     # Agent configuration and execution
│   │   │   ├── AICoreHelpers.ts # Utility functions
│   │   │   ├── ErrorAICore.ts # Custom error handling
│   │   │   ├── README.md      # Comprehensive documentation
│   │   │   └── models/        # AICore models
│   │   │       ├── AIChatTurn.ts # Chat response handling
│   │   │       ├── AIAgentTurn.ts # Agent execution wrapper
│   │   │       ├── AICoreTurn.ts # Base turn class
│   │   │       ├── AICoreInputCell.ts # Input message builder
│   │   │       ├── AIHistory.ts # History store
│   │   │       ├── AIHistoryItem.ts # History entries
│   │   │       ├── AgentStore.ts # Agent registry
│   │   │       ├── AgentInputItemModel.ts # Agent input formatting
│   │   │       ├── AgentOutputItemModel.ts # Agent output formatting
│   │   │       └── ResponseInputItemModel.ts # Response formatting
│   │   ├── ClusterManager/    # Process management
│   │   ├── Database/          # PostgreSQL service
│   │   ├── EventEndpoint/     # Event handling
│   │   ├── Microservice/      # Base microservice class
│   │   ├── RedisDB/          # Redis integration
│   │   ├── Route/            # Route management with auth
│   │   ├── ServerAPI/        # HTTP/HTTPS server with middleware
│   │   ├── SlackApp/         # Slack bot service
│   │   ├── SocketServer/     # Socket.IO implementation
│   │   └── VirtualBrowser/   # Headless browser automation service
│   ├── global/               # Global types and utilities
│   ├── models/               # Data models
│   └── prompts/              # AI prompt templates
│       └── instructions/     # Agent instruction files
│           ├── cv-agent.md   # CV generation agent instructions
│           └── summary-chat.md # Chat summary instructions
├── cert/                     # SSL certificates
├── docker-compose.yml        # Docker services configuration
├── Dockerfile               # Container build instructions
├── app.ts                   # Main application entry
└── package.json            # Dependencies and scripts
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (if not using Docker)
- Redis (if not using Docker)
- OpenAI API Key
- Slack App credentials (optional)

### Installation

#### Option 1: Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/FelipeRamosDev/feliperamos-cv.git
   cd feliperamos-api
   ```

2. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_ASSISTANT_ID=your_assistant_id (legacy, for backward compatibility)
   OPENAI_ASSISTANT_BUILD_CV=your_cv_generation_assistant_id (legacy, for backward compatibility)
   
   # Server Configuration
   SOCKET_SERVER_PORT=5000
   SERVER_API_PORT=7000
   SLACK_SERVER_PORT=4000
   API_SECRET=your_api_secret
   
   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Database Configuration (Docker)
   DB_TYPE=postgres
   DB_HOST=postgres
   DB_PORT=5432
   POSTGRES_DB=feliperamos-api
   POSTGRES_USER=feliperamos
   POSTGRES_PASSWORD=your_db_password
   
   # Master User Configuration
   MASTER_USER_EMAIL=felipe@feliperamos.dev
   MASTER_USER_PASSWORD=your_master_password
   MASTER_USER_FIRST_NAME=Felipe
   MASTER_USER_LAST_NAME=Ramos
   
   # Redis Configuration (Docker)
   REDIS_URL=redis://localhost:6000
   REDIS_HOST=redis
   REDIS_PORT=6000
   REDIS_PASSWORD=your_redis_password
   
   # SSL Configuration (Optional)
   SSL_KEY_PATH=./cert/ssl.key
   SSL_CERT_PATH=./cert/ssl.crt
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
   
   # Slack Configuration (Optional)
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your_signing_secret
   ```

3. **Start all services with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up -d --build
   
   # View logs
   docker-compose logs -f
   
   # Stop all services
   docker-compose down
   ```

4. **Verify services are running**
   ```bash
   # Check service status
   docker-compose ps
   
   # Check specific service logs
   docker-compose logs ai-service
   docker-compose logs socket-server
   ```

#### Option 2: Local Development Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FelipeRamosDev/feliperamos-cv.git
   cd feliperamos-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_ASSISTANT_ID=your_assistant_id (legacy, for backward compatibility)
   OPENAI_ASSISTANT_BUILD_CV=your_cv_generation_assistant_id (legacy, for backward compatibility)
   
   # Server Configuration
   SOCKET_SERVER_PORT=5000
   SERVER_API_PORT=7000
   SLACK_SERVER_PORT=4000
   API_SECRET=your_api_secret
   
   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Database Configuration (Local)
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   POSTGRES_DB=feliperamos-api
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   
   # Master User Configuration
   MASTER_USER_EMAIL=felipe@feliperamos.dev
   MASTER_USER_PASSWORD=your_master_password
   MASTER_USER_FIRST_NAME=Felipe
   MASTER_USER_LAST_NAME=Ramos
   
   # Redis Configuration (Local)
   REDIS_URL=redis://localhost:6000
   REDIS_HOST=localhost
   REDIS_PORT=6000
   REDIS_PASSWORD=your_redis_password
   
   # SSL Configuration (Optional)
   SSL_KEY_PATH=./cert/ssl.key
   SSL_CERT_PATH=./cert/ssl.crt
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
   
   # Slack Configuration (Optional)
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your_signing_secret
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Set up local databases (if not using Docker)**
   ```bash
   # Start PostgreSQL (example for macOS with Homebrew)
   brew services start postgresql
   
   # Start Redis (example for macOS with Homebrew)
   brew services start redis
   
   # Or use Docker for databases only
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=your_password postgres:16
   docker run -d --name redis -p 6000:6000 redis:7-alpine redis-server --requirepass your_password
   ```

## 🚀 Running the Application

### Development Mode

**Start all services individually:**
```bash
# AI Service
npm run watch:ai

# Socket Server
npm run watch:socket-server

# API Server
npm run watch:api-server

# Slack Service (optional)
npm run watch:slack
```

**Or start all services at once:**
```bash
npm run dev:watch
```

### Production Mode

**Using Docker Compose (Recommended):**
```bash
docker-compose up -d
```

**Using npm scripts:**
```bash
npm run build
npm run start:ai &
npm run start:socket-server &
npm run start:api-server &
npm run start:slack &
```

## 📜 Available Scripts

### Development
| Script | Description |
|--------|-------------|
| `npm run dev` | Start main application with ts-node |
| `npm run dev:watch` | Start with auto-reload |
| `npm run dev:ai` | Start AI service only |
| `npm run dev:socket-server` | Start Socket server only |
| `npm run dev:api-server` | Start API server only |
| `npm run dev:slack` | Start Slack service only |
| `npm run dev:virtual-browser` | Start VirtualBrowser service only |

### Production
| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start built application |
| `npm run start:ai` | Start built AI service |
| `npm run start:socket-server` | Start built Socket server |
| `npm run start:api-server` | Start built API server |
| `npm run start:slack` | Start built Slack service |
| `npm run start:virtual-browser` | Start built VirtualBrowser service |

### Watch Mode
| Script | Description |
|--------|-------------|
| `npm run watch:ai` | Watch AI service with nodemon |
| `npm run watch:socket-server` | Watch Socket server with nodemon |
| `npm run watch:api-server` | Watch API server with nodemon |
| `npm run watch:slack` | Watch Slack service with nodemon |
| `npm run watch:virtual-browser` | Watch VirtualBrowser service with nodemon |

### Utilities
| Script | Description |
|--------|-------------|
| `npm run clean` | Remove dist directory |
| `npm run clean:cache` | Clear ts-node and npm cache |
| `npm run debug:socket-fresh` | Fresh socket debug (PowerShell) |

## 🤖 AICore Service Features

### OpenAI Agents SDK Integration
- **Multi-Agent Architecture**: Orchestrate multiple specialized AI agents with distinct roles and capabilities
- **Agent-Based Execution**: Run agents with tool integration, function calling, and structured outputs
- **Agent Handoffs**: Seamlessly delegate tasks between agents for complex workflows
- **Flexible Configuration**: Configure agents with custom instructions, tools, guardrails, and model settings
- **Context Management**: Type-safe context handling with generic type support for custom contexts

### Chat Management System
- **Persistent Chat Sessions**: Database-backed chat sessions with unique IDs and labels
- **Intelligent History Tracking**: Automatic conversation history management with role-based organization
- **Multi-Model Support**: Configure different AI models per chat or per response (gpt-4o, gpt-4o-mini, etc.)
- **Instruction System**: Load instructions from text, markdown files, or inline strings
- **Agent Store**: Manage multiple agents per chat session with easy retrieval and configuration

### Dual Response Patterns

#### Chat Response Pattern (`AIChatTurn`)
- Direct OpenAI response streaming with real-time callbacks
- Non-streaming `.create()` for immediate complete responses
- Streaming `.stream()` with event callbacks (text deltas, status updates, completion, errors)
- Full history integration with automatic context management
- Multi-modal input support (text, files, images)

#### Agent Response Pattern (`AIAgentTurn`)
- Synchronous `.run()` for agent execution with tool usage
- Streaming `.stream(onChunk)` for real-time agent output
- Automatic tool invocation and result handling
- Agent-to-agent handoff support
- Output guardrails and validation

### Advanced Input Handling
- **Text Content**: Simple text messages with role specification (user, assistant, system)
- **File Attachments**: Attach files by OpenAI file ID or local file path with automatic base64 encoding
- **Image Support**: Attach images by URL or local path with automatic MIME type detection
- **Multi-modal Arrays**: Combine text, images, and files in single messages

### AI-Powered Career Content Generation
- **Job-Specific CV Summaries**: Generate tailored CV summaries using specialized agents
- **Personalized Cover Letters**: Create compelling cover letters with company and job context
- **LinkedIn Integration**: Extract job descriptions and create matching content
- **ATS Optimization**: AI-generated content optimized for Applicant Tracking Systems
- **Custom Prompts**: Flexible prompt system with instruction files and inline customization
- **Real-time Generation**: Socket-based real-time content creation with status updates

### Enhanced AI Capabilities
- **Model Flexibility**: Support for all OpenAI models (gpt-4o, gpt-4o-mini, gpt-4-turbo, etc.)
- **Tool Integration**: Extensible tool system with Zod schema validation
- **Context Awareness**: AI understands job requirements, company culture, and career progression
- **Error Recovery**: Comprehensive error handling with detailed error codes and messages
- **Type Safety**: Full TypeScript coverage with generic types for contexts and outputs

### Core Capabilities
- Career history inquiries with context-aware responses
- Skills and expertise questions with AI-powered analysis
- Project discussions with detailed technical understanding
- Professional experience details extraction and summarization
- Resume/CV information and customization with agent-based generation
- Cover letter creation and personalization using specialized agents
- Job-specific content optimization with ATS compliance
- LinkedIn job data analysis and intelligent matching

### Developer Experience
- **Fluent API**: Chain method calls for intuitive chat and agent configuration
- **Comprehensive Documentation**: Extensive README in `src/services/AICore/` with usage examples
- **Type-Safe Design**: Generic types for custom contexts, tools, and outputs
- **Error Handling**: Custom `ErrorAICore` class with descriptive error codes
- **Helper Utilities**: File loading, MIME type detection, and base64 encoding utilities

## 🔌 Socket Server Features

### Real-time Communication
- **Namespaces**: Organized communication channels (`/cv-chat`, `/custom-cv`)
- **Room Management**: Dynamic room creation and management
- **Event Handling**: Custom event system with type safety
- **Connection Tracking**: Client connection statistics and monitoring

### Socket Events
#### CV Chat Namespace (`/cv-chat`)
- `start-chat` - Initialize new chat session
- `assistant-message` - AI response delivery
- `assistant-typing` - Typing indicators
- `user-message` - User message handling

#### Cover Letter Namespace (`/cover-letter`)
- `generate-letter` - AI-powered cover letter generation
- `letter-status` - Real-time generation status updates
- `letter-complete` - Completed cover letter delivery
- `letter-error` - Error handling for failed generations

#### Opportunities Namespace (`/opportunities`)
- `generate-summary` - AI-powered CV summary generation for specific opportunities
- `summary-status` - Real-time CV summary generation status updates
- `summary-complete` - Completed CV summary delivery
- `summary-error` - Error handling for failed CV summary generations

## 🖥️ VirtualBrowser Service Features

### Headless Browser Automation
- **Puppeteer Integration**: Chrome/Chromium headless browser automation
- **Page Management**: Multiple browser pages with lifecycle management
- **PDF Generation**: High-quality PDF creation from web content
- **Viewport Configuration**: Customizable browser viewport settings
- **Event-Driven Architecture**: Automatic PDF generation triggered by database events

### VirtualBrowser Service Capabilities
- **CV/Resume PDFs**: Automated CV PDF creation in multiple languages
- **LinkedIn Job Extraction**: Automated extraction of job titles, company information, and detailed descriptions from LinkedIn postings
- **Real-time Updates**: PDFs regenerated when CV data changes
- **Multi-language Support**: PDFs generated for different locales
- **File Management**: Automatic PDF storage and cleanup
- **Template Rendering**: Web-based CV templates rendered to PDF
- **Modal Handling**: Intelligent handling of LinkedIn login modals and UI elements
- **Dynamic Content Loading**: Support for "see more" buttons and expandable content

### Docker Integration
- **Containerized Browser**: Runs in Docker with proper Chromium setup
- **Health Checks**: Service health monitoring and auto-restart
- **Resource Management**: Optimized for server environments

## 🗄️ Database Services

### PostgreSQL Database
- **Schema Management**: Dynamic table and field creation with multi-schema support
- **Model Layer**: Object-relational mapping with TypeScript support
- **Query Builder**: Type-safe query construction with join capabilities
- **Connection Pooling**: Efficient connection management
- **Migration Support**: Database version control and schema evolution
- **Multi-language Sets**: Support for internationalization with language-specific content

### Database Schemas
- **Users Schema**: Admin user management with role-based access
- **Skills Schema**: Technical skills with proficiency levels and categories
- **Companies Schema**: Company profiles with industry information
- **Experiences Schema**: Work experience tracking with detailed descriptions
- **Languages Schema**: Language skills with proficiency levels and locale support
- **Educations Schema**: Educational background with institutions, degrees, and academic achievements
- **Curriculums Schema**: Enhanced CV/Resume management with integrated languages, educations, and favoriting capabilities
- **Opportunities Schema**: Job opportunities with company relationships, LinkedIn integration, and CV associations
- **Letters Schema**: Cover letter storage with user, company, and opportunity relationships
- **Messages Schema**: Chat sessions and comments with AI conversation persistence
  - **Chats Table**: Persistent chat sessions with labels, models, and instructions
  - **Comments Table**: Commentary system for opportunities and letters

### Redis Cache
- **Session Storage**: User session persistence with JWT integration
- **Pub/Sub Messaging**: Inter-service communication
- **Data Caching**: Performance optimization
- **Collection Management**: Document-style operations

## 🐳 Docker Deployment

### Services Configuration
```yaml
services:
  ai-service:        # AICore service with OpenAI Agents SDK integration
  slack-service:     # Slack bot service  
  api-server:        # REST API server (Port 7000)
  socket-server:     # Socket.IO server (Port 5000)
  virtual-browser:   # VirtualBrowser service for PDF generation
  redis:            # Redis cache server with health checks
  postgres:         # PostgreSQL database with health checks
```

### Health Checks & Dependencies
- Service readiness monitoring with health check endpoints
- Automatic restart policies for failed services
- Dependency management with `depends_on` and health conditions
- Proper service startup order with database initialization

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Role-based Authorization**: Master, Admin, and User role hierarchy
- **Password Hashing**: bcrypt for secure password storage
- **CORS Configuration**: Cross-origin request security
- **SSL/TLS Support**: HTTPS encryption for production
- **API Secret**: Request authentication for internal services
- **Environment Variables**: Secure credential management
- **Input Validation**: Request sanitization and validation
- **Cookie Security**: HTTP-only cookies with secure flags
- **Session Management**: Secure session handling with Redis store

## 📊 Monitoring & Logging

- **Connection Statistics**: Real-time metrics tracking
- **Error Logging**: Comprehensive error reporting
- **Service Health**: Health check endpoints
- **Performance Metrics**: Response time monitoring

## 🧪 Development Tools

### Development Tools
- **Docker Compose**: Multi-service development environment
- **TypeScript**: Full type coverage with strict mode
- **Interface Definitions**: Comprehensive type definitions
- **Generic Types**: Reusable type patterns
- **Error Handling**: Comprehensive error management system

## 🌐 API Endpoints

### Authentication Routes
- `POST /auth/login` - User authentication with JWT token generation
- `GET /auth/user` - Get current authenticated user information

### Skills Management (Protected Routes)
- `POST /skill/create` - Create new skill (Admin/Master)
- `POST /skill/create-set` - Create skill language set (Admin/Master)
- `GET /skill/query` - Query user skills (Admin/Master)
- `GET /skill/:skill_id` - Get skill details by ID
- `PATCH /skill/update` - Update skill information (Admin/Master)
- `PATCH /skill/update-set` - Update skill language set (Admin/Master)
- `DELETE /skill/delete` - Delete skill (Admin/Master)
- `GET /skill/public/user-skills` - Get public skills for master user

### Companies Management (Protected Routes)
- `POST /company/create` - Create new company (Admin/Master)
- `POST /company/create-set` - Create company language set (Admin/Master)
- `GET /company/query` - Query user companies (Admin/Master)
- `GET /company/:company_id` - Get company details by ID
- `PATCH /company/update` - Update company information (Admin/Master)
- `PATCH /company/update-set` - Update company language set (Admin/Master)
- `DELETE /company/delete` - Delete company (Admin/Master)

### Languages Management (Protected Routes)
- `POST /language/create` - Create new language skill (Admin/Master)
- `GET /language/:language_id` - Get language details by ID
- `PATCH /language/update` - Update language information (Admin/Master)
- `DELETE /language/delete` - Delete language skill (Admin/Master)

### Education Management (Protected Routes)
- `POST /education/create` - Create new education record (Admin/Master)
- `GET /education/:education_id` - Get education details by ID
- `PATCH /education/update` - Update education information (Admin/Master)
- `PATCH /education/update-set` - Update education language set (Admin/Master)
- `DELETE /education/delete` - Delete education record (Admin/Master)

### Experience Management (Protected Routes)
- `POST /experience/create` - Create new experience (Admin/Master)
- `POST /experience/create-set` - Create experience language set (Admin/Master)
- `GET /experience/query` - Query user experiences (Admin/Master)
- `GET /experience/:experience_id` - Get experience details by ID
- `PATCH /experience/update` - Update experience information (Admin/Master)
- `PATCH /experience/update-set` - Update experience language set (Admin/Master)
- `DELETE /experience/delete` - Delete experience (Admin/Master)
- `GET /experience/public/user-experiences` - Get public experiences for master user

### Curriculum/CV Management (Protected Routes)
- `POST /curriculum/create` - Create new CV/resume (Admin/Master)
- `POST /curriculum/create-set` - Create CV language set (Admin/Master)
- `GET /curriculum/:cv_id` - Get CV details by ID (Admin/Master)
- `PATCH /curriculum/update` - Update CV information (Admin/Master)
- `PATCH /curriculum/update-set` - Update CV language set (Admin/Master)
- `PATCH /curriculum/set-master` - Set CV as master/primary CV (Admin/Master)
- `DELETE /curriculum/delete` - Delete CV (Admin/Master)
- `GET /curriculum/public/:cv_id` - Get public CV data for display

### Job Opportunity Management (Protected Routes)
- `POST /opportunity/create` - Create new job opportunity (Admin/Master)
- `GET /opportunity/search` - Search job opportunities with advanced filtering (Admin/Master)
- `PATCH /opportunity/update` - Update opportunity information (Admin/Master)
- `DELETE /opportunity/delete` - Delete job opportunity (Admin/Master)

### Cover Letter Management (Protected Routes)
- `POST /cover-letter/create` - Create new cover letter (Admin/Master)
- `GET /cover-letter/search/:id` - Search cover letters with filtering options, use 'all' for all letters (Admin/Master)
- `PATCH /cover-letter/update/:id` - Update cover letter information (Admin/Master)
- `DELETE /cover-letter/delete/:id` - Delete cover letter (Admin/Master)

### User Management (Protected Routes)
- `PATCH /user/update` - Update user profile information (Admin/Master)
- `GET /user/languages` - Get user's language skills (Admin/Master)
- `GET /user/educations` - Get user's education records (Admin/Master)
- `GET /user/master-cv` - Get master user's primary CV
- `GET /user/cvs` - Get user's CVs with filtering options (Admin/Master)

### General
- `POST /virtual-browser/linkedin/job-infos` - Extract job information from LinkedIn URLs (Admin/Master)
- `GET /health` - Service health status and diagnostics

### Socket-based AI Routes (Event Endpoints)
- `/ai/get-chat` - Retrieve chat session by ID (Event endpoint for inter-service communication)
- `/ai/generate-cv-summary` - Generate AI-powered CV summaries based on job requirements (Socket event)
- `/ai/generate-letter` - Generate AI-powered cover letters for specific opportunities (Socket event)
- `/ai/assistant-generate` - Generate AI responses (Socket event)

## 🚀 Production Deployment

### Environment Setup
1. Configure production environment variables
2. Set up SSL certificates
3. Configure database connections
4. Set up Redis cluster

### Scaling
- **Horizontal Scaling**: Multiple service instances
- **Load Balancing**: Request distribution
- **Cluster Mode**: Multi-process support

## 📋 What's New in v1.7.0

### 🤖 AICore Service - OpenAI Agents SDK Integration
- **Complete AI Service Rewrite**: Migrated from OpenAI Assistant API to OpenAI Agents SDK (`@openai/agents`) for advanced AI orchestration
- **Multi-Agent Architecture**: Support for multiple specialized agents with distinct roles, tools, and capabilities
- **Agent-Based Execution**: New `AIAgent` class with support for tool integration, function calling, and agent handoffs
- **Dual Response Patterns**: Separate patterns for chat responses (`AIChatTurn`) and agent execution (`AIAgentTurn`)
- **Enhanced Chat Management**: New `AICoreChat` class with persistent database storage, history tracking, and agent registry
- **Intelligent History System**: `AIHistory` and `AIHistoryItem` classes for conversation context management
- **Advanced Input Handling**: `AICoreInputCell` with support for text, file attachments, and image uploads
- **Instruction System**: Load agent/chat instructions from markdown files or inline text
- **Type-Safe Design**: Comprehensive TypeScript coverage with generic types for contexts and outputs
- **Helper Utilities**: File loading, MIME type detection, and base64 encoding for multi-modal inputs

### 🗄️ Database Schema Updates
- **New Schema**: `messages_schema` (renamed from `comments_schemas`)
- **New Table**: `chats` table for persistent chat sessions with labels, models, and instructions
- **New Model**: `Chat` class with database integration and AI chat retrieval methods
- **Schema Migration**: Updated database initialization to use `messages_schema`

### 🔧 Technical Enhancements
- **OpenAI SDK Update**: Upgraded to OpenAI SDK v5.23+ (from v4.103) with response streaming support
- **New Dependencies**: Added `@openai/agents` (v0.1.9) and `zod` (v3.25+) for schema validation
- **Inter-Service Communication**: New `/ai/get-chat` event endpoint for retrieving chat sessions across services
- **Microservice Improvements**: Enhanced `Microservice` class with static methods for cross-service communication
- **Error Handling**: New `ErrorAICore` class with descriptive error codes and improved error management
- **TypeScript Configuration**: Updated `tsconfig.json` with deprecation handling for OpenAI SDK compatibility

### 📚 Documentation & Developer Experience
- **Comprehensive README**: Added extensive documentation in `src/services/AICore/README.md` with:
  - Architecture overview and class descriptions
  - Usage examples (basic chat, streaming, file attachments, agents)
  - Error handling patterns and best practices
  - Type definitions and API reference
- **GitHub Copilot Instructions**: Updated `.github/copilot-instructions.md` with AICore patterns
- **VS Code Integration**: New "AI Service Watch" debug configuration in `.vscode/launch.json`
- **Code Examples**: Template instruction files in `src/prompts/instructions/`

### 🚀 Migration Notes
- **Breaking Changes**: Old `AI` service patterns no longer supported (legacy code remains for backward compatibility)
- **New API**: Use `AICore.startChat()` instead of old assistant-based methods
- **Chat Persistence**: All chats now stored in database with unique IDs
- **Agent System**: Leverage new agent architecture for specialized AI tasks

## 📋 What's New in v1.6.0

### 📝 Cover Letter Management System
- **AI-Powered Cover Letter Generation**: Complete cover letter creation system with OpenAI integration for personalized, job-specific cover letters
- **Cover Letter CRUD Operations**: Full API endpoints for creating, searching, updating, and deleting cover letters with advanced filtering
- **PDF Generation**: Automatic PDF generation for cover letters with file management and cleanup
- **Real-time Status Updates**: Socket-based status updates during cover letter generation process
- **Letter Templates**: Flexible cover letter templates with AI-powered customization

### 💼 Job Opportunity Management
- **LinkedIn Job Scraping**: Enhanced automated scraping of LinkedIn job postings with comprehensive data extraction for job URL, location, seniority, and employment type
- **Opportunity CRUD Operations**: Full API support for creating, searching, updating, and deleting job opportunities
- **CV Summary Generation**: AI-powered CV summary generation tailored to specific job opportunities
- **Enhanced Search Capabilities**: Advanced filtering, sorting, and user scoping for opportunity searches
- **Company Integration**: Seamless integration with company profiles for comprehensive job tracking

### 🗄️ Database Schema Enhancements
- **Opportunities Schema**: Complete table structure with job details, company relationships, and CV associations
- **Letters Schema**: Cover letter storage with user, company, and opportunity relationships
- **Comments Schema**: Commentary system for opportunities and letters
- **Enhanced Relationship Mapping**: Improved data validation and type safety across all models

### � API & Service Improvements
- **RESTful API Standardization**: Fixed HTTP method standards (POST → PATCH/DELETE where appropriate)
- **Improved Route Parameter Handling**: Enhanced validation and error handling
- **Socket Integration**: New namespaces for `cover-letter` and `opportunities` with real-time event handling
- **AI Service Integration**: Updated AI model configuration (gpt-4o-mini) with enhanced prompt engineering

### �️ Developer Experience
- **Code Organization**: VSCode snippets for faster development and improved project structure
- **Namespace Restructuring**: Consolidated socket namespaces with deprecated `custom-cv` removed
- **Type Safety**: Enhanced TypeScript definitions across all new features
- **Infrastructure**: Docker improvements with shared directory for letter storage

### 🚀 Technical Enhancements
- **Configuration Updates**: Updated tsconfig.json for Node16 module compatibility
- **Enhanced Error Handling**: Comprehensive error management for AI generation and job processing
- **Performance Improvements**: Optimized database queries and API response times
- **Security Updates**: Enhanced authentication and authorization for new endpoints

## 📋 Previous Versions

### What's New in v1.5.0 - AI-Powered CV Customization & LinkedIn Integration
- **Dedicated CV Generation Assistant**: New OpenAI assistant specifically trained for CV summary generation
- **Job-Specific CV Summaries**: Generate tailored CV summaries based on specific job requirements and descriptions
- **LinkedIn Job Scraping**: Automated extraction of job titles, company information, and detailed descriptions from LinkedIn URLs
- **CV Favorites System**: Added favoriting capabilities with improved filtering options
- **Real-time AI Generation**: Socket.IO namespaces for real-time CV summary generation with status updates
- **Custom Prompt Support**: Flexible AI prompt system allowing custom instructions for CV generation

### What's New in v1.4.0

### 🎯 Major Features Added
- **Language Management System**: Complete CRUD operations for language skills with proficiency tracking
- **Education Management System**: Full educational background management with institutions and degrees
- **Enhanced CV Integration**: Extended CV model to include languages and educations data
- **ATS-Ready Data Structure**: Optimized data models for Applicant Tracking System compatibility

### 🔧 Technical Improvements
- **Extended Database Schemas**: New languages_schema and educations_schema with relational integrity
- **Improved API Coverage**: Additional endpoints for comprehensive language and education management
- **Enhanced Data Population**: Automated population of languages and educations in CV objects
- **Multi-language Education Support**: Education records with language set support for internationalization

### 🗂️ Database Schema Additions
- **Languages Schema**: Language skills with proficiency levels and locale information
- **Educations Schema**: Educational background with institutions, degrees, and academic details
- **Enhanced CV Schema**: Extended CV fields to support cv_languages and cv_educations arrays

### 🚀 Development Experience
- **Type-Safe Language Management**: Comprehensive TypeScript interfaces for language operations
- **Education Data Modeling**: Robust education entities with validation and error handling
- **Improved Service Integration**: Seamless integration between languages, educations, and CV services
- **Enhanced API Documentation**: Updated endpoint documentation with new language and education routes

## 📋 Previous Versions

### What's New in v1.3.0
- **CV/Resume Management System**: Complete curriculum vitae creation, editing, and management
- **VirtualBrowser Service**: Headless browser automation service for PDF generation
- **Automated PDF Generation**: Real-time CV PDF creation with multi-language support
- **Database Events System**: Event-driven architecture for automatic PDF updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Contact

**Felipe Ramos**
- Portfolio: [https://feliperamos.dev](https://feliperamos.dev)
- Email: felipe@feliperamos.dev
- LinkedIn: [linkedin.com/in/feliperamos-dev](https://linkedin.com/in/feliperamos-dev)
- GitHub: [github.com/FelipeRamosDev](https://github.com/FelipeRamosDev)
