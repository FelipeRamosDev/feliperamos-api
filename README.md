# Felipe Ramos API - Microservices Backend (v1.4.0)

A sophisticated microservices-based backend system powering Felipe Ramos' interactive portfolio and AI-powered career chat. Now featuring complete admin dashboard capabilities with full CRUD operations, JWT authentication, and comprehensive database management. Built with Node.js, TypeScript, and a modular architecture supporting real-time communication, AI assistance, and Slack integration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 🚀 Features

### New in v1.2.0 - Admin Dashboard & Database Management
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
- **AI-Powered Chat**: OpenAI GPT integration for intelligent career-related conversations
- **Real-time Communication**: Socket.IO server with namespace and room management
- **Microservices Architecture**: Modular, scalable service-oriented design
- **Slack Integration**: Automated Slack bot for notifications and interactions
- **Redis Cache Layer**: High-performance caching and session management
- **PostgreSQL Database**: Robust relational data storage with schema management
- **Docker Support**: Containerized deployment with Docker Compose
- **SSL/HTTPS Support**: Production-ready security configuration
- **Cluster Management**: Multi-process support for high availability
- **RESTful APIs**: Well-structured API endpoints with comprehensive documentation

## 🏗️ Architecture

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **AI Service** | - | OpenAI GPT assistant integration |
| **Socket Server** | 5000 | Real-time WebSocket communication |
| **API Server** | 3001 | RESTful API endpoints |
| **Slack Service** | 4000 | Slack bot and webhook handling |
| **VirtualBrowser Service** | - | Headless browser automation for PDF generation |

### Core Services

- **🤖 AI Service**: OpenAI assistant with thread management
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
- **OpenAI API 4.103+** - GPT assistant integration
- **Slack Bolt 4.4+** - Slack app framework
- **Puppeteer 24.15+** - Headless browser automation for PDF generation

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
│   │   ├── ai.service.ts       # AI/OpenAI service
│   │   ├── api-server.service.ts # REST API server
│   │   ├── slack.service.ts    # Slack integration
│   │   ├── socket-server.service.ts # Socket.IO server
│   │   ├── virtual-browser.service.ts # VirtualBrowser service
│   │   ├── namespaces/         # Socket namespaces
│   │   └── routes/             # API route definitions
│   │       └── virtual-browser/ # VirtualBrowser event routes
│   ├── database/               # Database layer
│   │   ├── index.ts           # Database initialization
│   │   ├── models/            # Data models & ORM
│   │   │   ├── users_schema/  # User management models
│   │   │   ├── skills_schema/ # Skills management models
│   │   │   ├── companies_schema/ # Company management models
│   │   │   ├── curriculums_schema/ # CV/Resume management models
│   │   │   └── experiences_schema/ # Experience management models
│   │   ├── schemas/           # Database schema definitions
│   │   └── tables/            # Table structure definitions
│   ├── routes/                # API endpoint implementations
│   │   ├── auth/              # Authentication routes
│   │   ├── skill/             # Skills CRUD operations
│   │   ├── company/           # Company CRUD operations
│   │   ├── curriculum/        # CV/Resume CRUD operations
│   │   ├── experience/        # Experience CRUD operations
│   │   ├── user/              # User management routes
│   │   └── health.route.ts    # Health check endpoint
│   ├── services/              # Core service classes
│   │   ├── AI/                # OpenAI integration
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
│   └── models/               # Data models
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
   OPENAI_ASSISTANT_ID=your_assistant_id
   
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
   OPENAI_ASSISTANT_ID=your_assistant_id
   
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

## 🖥️ VirtualBrowser Service Features

### Headless Browser Automation
- **Puppeteer Integration**: Chrome/Chromium headless browser automation
- **Page Management**: Multiple browser pages with lifecycle management
- **PDF Generation**: High-quality PDF creation from web content
- **Viewport Configuration**: Customizable browser viewport settings
- **Event-Driven Architecture**: Automatic PDF generation triggered by database events

### PDF Generation Capabilities
- **CV/Resume PDFs**: Automated CV PDF creation in multiple languages
- **Real-time Updates**: PDFs regenerated when CV data changes
- **Multi-language Support**: PDFs generated for different locales
- **File Management**: Automatic PDF storage and cleanup
- **Template Rendering**: Web-based CV templates rendered to PDF

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

### Redis Cache
- **Session Storage**: User session persistence with JWT integration
- **Pub/Sub Messaging**: Inter-service communication
- **Data Caching**: Performance optimization
- **Collection Management**: Document-style operations

## 🐳 Docker Deployment

### Services Configuration
```yaml
services:
  ai-service:        # OpenAI integration service
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
- `POST /skill/update` - Update skill information (Admin/Master)
- `POST /skill/update-set` - Update skill language set (Admin/Master)
- `GET /skill/public/user-skills` - Get public skills for master user

### Companies Management (Protected Routes)
- `POST /company/create` - Create new company (Admin/Master)
- `POST /company/create-set` - Create company language set (Admin/Master)
- `GET /company/query` - Query user companies (Admin/Master)
- `GET /company/:company_id` - Get company details by ID
- `POST /company/update` - Update company information (Admin/Master)
- `POST /company/update-set` - Update company language set (Admin/Master)

### Experience Management (Protected Routes)
- `POST /experience/create` - Create new experience (Admin/Master)
- `POST /experience/create-set` - Create experience language set (Admin/Master)
- `GET /experience/query` - Query user experiences (Admin/Master)
- `GET /experience/:experience_id` - Get experience details by ID
- `POST /experience/update` - Update experience information (Admin/Master)
- `POST /experience/update-set` - Update experience language set (Admin/Master)
- `GET /experience/public/user-experiences` - Get public experiences for master user

### Curriculum/CV Management (Protected Routes)
- `POST /curriculum/create` - Create new CV/resume (Admin/Master)
- `POST /curriculum/create-set` - Create CV language set (Admin/Master)
- `GET /curriculum/user-cvs` - Get user's CVs (Admin/Master)
- `GET /curriculum/:cv_id` - Get CV details by ID (Admin/Master)
- `POST /curriculum/update` - Update CV information (Admin/Master)
- `POST /curriculum/update-set` - Update CV language set (Admin/Master)
- `POST /curriculum/set-master` - Set CV as master/primary CV (Admin/Master)
- `DELETE /curriculum/delete` - Delete CV (Admin/Master)
- `GET /curriculum/public/:cv_id` - Get public CV data for display
- `GET /user/master-cv` - Get master user's primary CV

### User Management (Protected Routes)
- `POST /user/update` - Update user profile information (Admin/Master)

### AI & System Routes
- `POST /assistant-generate` - Generate AI responses
- `GET /health` - Service health status and diagnostics

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

## 📋 What's New in v1.3.0

### 🎯 Major Features Added
- **CV/Resume Management System**: Complete curriculum vitae creation, editing, and management
- **VirtualBrowser Service**: Headless browser automation service for PDF generation
- **Automated PDF Generation**: Real-time CV PDF creation with multi-language support
- **Database Events System**: Event-driven architecture for automatic PDF updates

### 🔧 Technical Improvements
- **VirtualBrowser Integration**: Puppeteer-based headless browser service with PDF generation
- **Event-Driven Architecture**: Database events triggering automatic PDF updates
- **File System Integration**: PDF storage and management capabilities

### 🗂️ Database Schema
- **Curriculums Schema**: CV/Resume data with language sets and PDF management

### 🚀 Development Experience
- **Simplified Configuration**: Streamlined VS Code debugging setup
- **Enhanced Docker Support**: Improved health checks and service dependencies
- **Better Type Safety**: Enhanced TypeScript definitions and interfaces
- **Cleaner Architecture**: Improved service organization and separation of concerns

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
