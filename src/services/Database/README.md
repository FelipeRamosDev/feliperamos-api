# PostgresDB Service

A comprehensive PostgreSQL database adapter service that provides a powerful ORM-like interface for managing database schemas, tables, and CRUD operations. This service extends the base `DataBase` class and offers connection pooling, query builders, and automated schema synchronization.

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 🚀 Features

- **Connection Pooling**: Efficient PostgreSQL connection management using `pg` Pool
- **Schema Management**: Automated schema creation and synchronization
- **Table Management**: Dynamic table creation with column synchronization
- **Query Builders**: Fluent API for SELECT, INSERT, UPDATE, and DELETE operations
- **Error Handling**: Standardized error management with custom error types
- **Test User Creation**: Built-in test user setup for development environments
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## 📦 Installation

The PostgresDB service is part of the Felipe Ramos API project. Ensure you have the following dependencies installed:

```bash
npm install pg @types/pg bcrypt @types/bcrypt
```

## 🔧 Configuration

### Database Setup

```typescript
import PostgresDB from './src/services/Database/PostgresDB';

const dbConfig = {
   dbName: 'your_database',
   host: 'localhost',
   user: 'postgres',
   password: 'your_password',
   port: 5432,
   schemas: [
      // Your schema definitions
   ],
   onReady: (db) => console.log('Database ready!'),
   onError: (error) => console.error('Database error:', error)
};

const db = new PostgresDB(dbConfig);
```

### Environment Variables

Create a `.env` file with your database configuration:

```env
DB_NAME=your_database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
```

## 🏗️ Usage

### Basic Initialization

```typescript
import PostgresDB from './PostgresDB';

const db = new PostgresDB({
   dbName: 'myapp',
   host: 'localhost',
   user: 'postgres',
   password: 'mypassword',
   port: 5432
});

// Initialize the database connection
await db.init();
```

### Schema and Table Management

```typescript
// Schemas are automatically created during initialization
// Tables are synchronized with their field definitions
// Missing columns are added, extra columns are removed
```

### Query Operations

#### SELECT Queries

```typescript
// Simple select
const users = await db.select('users_schema', 'users')
    .where({ active: true })
    .limit(10)
    .exec();

// Complex select with joins and conditions
const userProfiles = await db.select('users_schema', 'users')
    .where({ 'users.active': true })
    .where({ 'profiles.verified': true })
    .orderBy('created_at', 'DESC')
    .exec();
```

#### INSERT Queries

```typescript
// Single record insert
const newUser = await db.insert('users_schema', 'users')
   .data({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword'
   })
   .exec();

// Multiple records insert
const newUsers = await db.insert('users_schema', 'users')
   .data([
      { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
      { first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com' }
   ])
   .exec();
```

#### UPDATE Queries

```typescript
// Update with conditions
const updated = await db.update('users_schema', 'users')
   .data({ last_login: new Date() })
   .where({ id: userId })
   .exec();

// Bulk update
const bulkUpdate = await db.update('users_schema', 'users')
   .data({ status: 'inactive' })
   .where({ last_login: { '<': '2023-01-01' } })
   .exec();
```

#### DELETE Queries

```typescript
// Delete with conditions
const deleted = await db.delete('users_schema', 'users')
   .where({ id: userId })
   .exec();

// Bulk delete
const bulkDelete = await db.delete('users_schema', 'users')
   .where({ created_at: { '<': '2022-01-01' } })
   .exec();
```

### Connection Management

```typescript
// Check connection status
const isConnected = await db.isConnected();

// Get schemas array
const schemas = db.getSchemasArray();
```

### Test User Creation

```typescript
// Automatically creates a test user for development
await db.createTestUser();
// Creates user with email: 'test@test.com' and password: 'Test!123'
```

## 🏗️ Architecture

### Class Hierarchy

```
DataBase (Abstract Base Class)
    ↓
PostgresDB (PostgreSQL Implementation)
```

### Key Components

| Component | Description |
|-----------|-------------|
| **PostgresDB** | Main database adapter class |
| **SelectSQL** | Query builder for SELECT operations |
| **InsertSQL** | Query builder for INSERT operations |
| **UpdateSQL** | Query builder for UPDATE operations |
| **DeleteSQL** | Query builder for DELETE operations |
| **Schema** | Schema model for database structure |
| **Table** | Table model with field definitions |
| **Field** | Field model for column definitions |
| **ErrorDatabase** | Custom error handling |

### Database Structure

The service manages multiple schemas with the following typical structure:

```
Database
├── users_schema
│   ├── users
│   └── user_sessions
├── companies_schema
│   └── companies
├── skills_schema
│   └── skills
├── experiences_schema
│   └── experiences
└── curriculums_schema
    └── curriculums
```

## 🔒 Security Features

- **Connection Pooling**: Prevents connection exhaustion attacks
- **Parameterized Queries**: Protection against SQL injection
- **Password Hashing**: bcrypt integration for secure password storage
- **Error Sanitization**: Prevents sensitive information leakage

## 🛠️ Development

### Testing

```typescript
// The service includes built-in test user creation
await db.createTestUser();

// Test connection
const connected = await db.isConnected();
console.log('Database connected:', connected);
```

### Error Handling

```typescript
import ErrorDatabase from './ErrorDatabase';

try {
    await db.init();
} catch (error) {
    if (error instanceof ErrorDatabase) {
        console.error('Database Error:', error.code, error.message);
    }
}
```

## 📚 API Reference

### Constructor

```typescript
constructor(setup: PostgresDBSetup)
```

**Parameters:**
- `setup.dbName`: Database name (inherited from base class)
- `setup.host`: Database host (inherited from base class)
- `setup.user`: PostgreSQL user (default: 'postgres')
- `setup.port`: Database port (default: 5432)
- `setup.password`: Database password
- `setup.schemas`: Array of schema definitions
- `setup.onReady`: Callback function executed when connection is ready
- `setup.onError`: Callback function executed on errors

### Methods

#### Connection Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `init()` | Initialize database connection and setup | `Promise<PostgresDB>` |
| `isConnected()` | Check if database is connected | `Promise<boolean>` |

#### Schema Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getSchemasArray()` | Get all managed schemas | `Schema[]` |
| `createSchema(schema)` | Create schema and tables | `Promise<void>` |
| `createTable(schemaName, table)` | Create a specific table | `Promise<void>` |
| `syncTable(tableName, schemaName, fields)` | Sync table structure | `Promise<void>` |

#### Query Builder Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `select(schema, table)` | Create SELECT query builder | `SelectSQL` |
| `insert(schema, table)` | Create INSERT query builder | `InsertSQL` |
| `update(schema, table)` | Create UPDATE query builder | `UpdateSQL` |
| `delete(schema, table)` | Create DELETE query builder | `DeleteSQL` |

#### Utility Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `createTestUser()` | Create test user for development | `Promise<void>` |

## 🐛 Error Codes

| Code | Description |
|------|-------------|
| `DB_POOL_NOT_INITIALIZED` | Connection pool not initialized |
| `DB_CONNECTION_ERROR` | Database connection failed |
| `DB_CONNECTION_CHECK_ERROR` | Connection check failed |
| `SCHEMA_CREATION_ERROR` | Schema creation failed |
| `TABLE_CREATION_ERROR` | Table creation failed |
| `TEST_USER_CREATION_ERROR` | Test user creation failed |

## 📋 Requirements

- Node.js 14+
- PostgreSQL 12+
- TypeScript 4+

## 🤝 Contributing

This service is part of the Felipe Ramos API project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

ISC License - see the main project LICENSE file for details.

## 🔗 Related Services

- **Database Base Class**: `./Database.ts`
- **Query Builders**: `./builders/`
- **Models**: `./models/`
- **Types**: `./types/`
- **Error Handling**: `./ErrorDatabase.ts`
