# Felipe Ramos API - Microservices Backend

A sophisticated microservices-based backend system powering Felipe Ramos' interactive portfolio and AI-powered career chat. Built with Node.js, TypeScript, and a modular architecture supporting real-time communication, AI assistance, and Slack integration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 🚀 Features

- **AI-Powered Chat**: OpenAI GPT integration for intelligent career-related conversations
- **Real-time Communication**: Socket.IO server with namespace and room management
- **Microservices Architecture**: Modular, scalable service-oriented design
- **Slack Integration**: Automated Slack bot for notifications and interactions
- **Redis Cache Layer**: High-performance caching and session management
- **PostgreSQL Database**: Robust relational data storage
- **Docker Support**: Containerized deployment with Docker Compose
- **SSL/HTTPS Support**: Production-ready security configuration
- **Cluster Management**: Multi-process support for high availability
- **RESTful APIs**: Well-structured API endpoints

## 🏗️ Architecture

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **AI Service** | - | OpenAI GPT assistant integration |
| **Socket Server** | 5000 | Real-time WebSocket communication |
| **API Server** | 3001 | RESTful API endpoints |
| **Slack Service** | 4000 | Slack bot and webhook handling |

### Core Services

- **🤖 AI Service**: OpenAI assistant with thread management
- **🔌 Socket Server**: Real-time communication with namespaces
- **🛡️ Server API**: HTTP/HTTPS server with CORS and security
- **💾 Redis DB**: Caching, sessions, and pub/sub messaging
- **🗄️ Database**: PostgreSQL with schema management
- **🏗️ Cluster Manager**: Process management and scaling

## 📦 Tech Stack

### Backend Core
- **Node.js 20+** - JavaScript runtime
- **TypeScript 5+** - Type-safe development
- **Express 5** - Web application framework
- **Socket.IO 4.8+** - Real-time bidirectional communication

### AI & Integration
- **OpenAI API 4.103+** - GPT assistant integration
- **Slack Bolt 4.4+** - Slack app framework

### Database & Caching
- **PostgreSQL 8.16+** - Primary database
- **Redis (ioredis 5.6+)** - Caching and session store

### Development & Deployment
- **Docker & Docker Compose** - Containerization
- **Nodemon** - Development auto-reload
- **ts-node** - TypeScript execution
- **Rimraf** - Clean build directories

## 📁 Project Structure

```
feliperamos-api/
├── src/
│   ├── containers/              # Service containers
│   │   ├── ai.service.ts       # AI/OpenAI service
│   │   ├── api-server.service.ts # REST API server
│   │   ├── slack.service.ts    # Slack integration
│   │   ├── socket-server.service.ts # Socket.IO server
│   │   ├── namespaces/         # Socket namespaces
│   │   └── routes/             # API route definitions
│   ├── services/               # Core service classes
│   │   ├── AI/                 # OpenAI integration
│   │   ├── ClusterManager/     # Process management
│   │   ├── Database/           # PostgreSQL service
│   │   ├── EventEndpoint/      # Event handling
│   │   ├── Microservice/       # Base microservice class
│   │   ├── RedisDB/           # Redis integration
│   │   ├── Route/             # Route management
│   │   ├── ServerAPI/         # HTTP/HTTPS server
│   │   ├── SlackApp/          # Slack bot service
│   │   └── SocketServer/      # Socket.IO implementation
│   ├── global/                # Global types and utilities
│   └── models/                # Data models
├── cert/                      # SSL certificates
├── docker-compose.yml         # Docker services configuration
├── Dockerfile                 # Container build instructions
├── app.ts                     # Main application entry
└── package.json              # Dependencies and scripts
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
   OPENAI_ASSISTANT_ID=your_assistant_id
   
   # Server Configuration
   SOCKET_SERVER_PORT=5000
   API_SERVER_PORT=3001
   SLACK_SERVER_PORT=4000
   API_SECRET=your_api_secret
   
   # Database Configuration (Docker)
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=feliperamos_db
   DB_USER=feliperamos
   DB_PASSWORD=your_db_password
   
   # Redis Configuration (Docker)
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
   OPENAI_ASSISTANT_ID=your_assistant_id
   
   # Server Configuration
   SOCKET_SERVER_PORT=5000
   API_SERVER_PORT=3001
   SLACK_SERVER_PORT=4000
   API_SECRET=your_api_secret
   
   # Database Configuration (Local)
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=feliperamos_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # Redis Configuration (Local)
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

### Production
| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start built application |
| `npm run start:ai` | Start built AI service |
| `npm run start:socket-server` | Start built Socket server |
| `npm run start:api-server` | Start built API server |
| `npm run start:slack` | Start built Slack service |

### Watch Mode
| Script | Description |
|--------|-------------|
| `npm run watch:ai` | Watch AI service with nodemon |
| `npm run watch:socket-server` | Watch Socket server with nodemon |
| `npm run watch:api-server` | Watch API server with nodemon |
| `npm run watch:slack` | Watch Slack service with nodemon |

### Utilities
| Script | Description |
|--------|-------------|
| `npm run clean` | Remove dist directory |
| `npm run clean:cache` | Clear ts-node and npm cache |
| `npm run debug:socket-fresh` | Fresh socket debug (PowerShell) |

## 🤖 AI Service Features

### OpenAI Integration
- **GPT Assistant**: Specialized AI trained on Felipe's professional background
- **Thread Management**: Persistent conversation contexts
- **Message Handling**: Structured request/response processing
- **Error Handling**: Robust error management and fallbacks

### Capabilities
- Career history inquiries
- Skills and expertise questions
- Project discussions
- Professional experience details
- Resume/CV information

## 🔌 Socket Server Features

### Real-time Communication
- **Namespaces**: Organized communication channels (`/cv-chat`)
- **Room Management**: Dynamic room creation and management
- **Event Handling**: Custom event system with type safety
- **Connection Tracking**: Client connection statistics and monitoring

### Socket Events
- `start-chat` - Initialize new chat session
- `assistant-message` - AI response delivery
- `assistant-typing` - Typing indicators
- `user-message` - User message handling

## 🗄️ Database Services

### PostgreSQL Database
- **Schema Management**: Dynamic table and field creation
- **Query Builder**: Type-safe query construction
- **Connection Pooling**: Efficient connection management
- **Migration Support**: Database version control

### Redis Cache
- **Session Storage**: User session persistence
- **Pub/Sub Messaging**: Inter-service communication
- **Data Caching**: Performance optimization
- **Collection Management**: Document-style operations

## 🐳 Docker Deployment

### Services Configuration
```yaml
services:
  ai-service:        # OpenAI integration service
  slack-service:     # Slack bot service  
  api-server:        # REST API server
  socket-server:     # Socket.IO server
  redis:            # Redis cache server
  postgres:         # PostgreSQL database
```

### Health Checks
- Service readiness monitoring
- Automatic restart policies
- Dependency management with `depends_on`

## 🔒 Security Features

- **CORS Configuration**: Cross-origin request security
- **SSL/TLS Support**: HTTPS encryption
- **API Secret**: Request authentication
- **Environment Variables**: Secure credential management
- **Input Validation**: Request sanitization

## 📊 Monitoring & Logging

- **Connection Statistics**: Real-time metrics tracking
- **Error Logging**: Comprehensive error reporting
- **Service Health**: Health check endpoints
- **Performance Metrics**: Response time monitoring

## 🧪 Development Tools

### Debugging
- **PowerShell Scripts**: Windows-specific debugging utilities
- **Fresh Compilation**: Cache clearing and restart utilities
- **Inspect Mode**: Node.js debugging support

### Type Safety
- **TypeScript**: Full type coverage
- **Interface Definitions**: Comprehensive type definitions
- **Generic Types**: Reusable type patterns

## 🌐 API Endpoints

### AI Service
- `POST /assistant-generate` - Generate AI responses

### Health Checks
- `GET /health` - Service health status
- `GET /stats` - Service statistics

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

---

**Built with ❤️ by Felipe Ramos**

*Showcasing modern backend architecture, AI integration, and real-time communication technologies.*
