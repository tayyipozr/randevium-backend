<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

## Description

Randevium Backend is a comprehensive appointment management system built with NestJS and Prisma ORM.

## Tech Stack

- NestJS v10
- Prisma v6.1.0
- PostgreSQL
- JWT Authentication
- Docker
- Dragonfly (Redis-compatible in-memory cache)
- Custom Logging System

## Features

- Authentication with JWT (Access & Refresh tokens)
  - Access token for API authentication (50m expiration)
  - Refresh token with secure rotation (7-day expiration)
  - Token blacklisting with Dragonfly cache
  - Secure token rotation on refresh
  - Protection against token reuse
- Role-based authorization (Admin, CompanyAdmin, CompanyEmployee, User)
- Database integration with Prisma ORM
- Caching layer with Dragonfly
  - Fast in-memory caching
  - Support for string and JSON data
  - Configurable TTL for cache entries
  - Token blacklist management
- Advanced Logging System
  - Colorized console output
  - Context-based logging
  - Environment-aware logging levels
  - ISO timestamp formatting
  - Stack trace support for errors
- Entity relationships:
  - Users & Roles (Many-to-Many)
  - Categories & Companies (Many-to-Many)
  - Services & Categories (Many-to-Many)
  - Companies & Employees (One-to-Many)
  - Services & Employees (One-to-Many)
  - Image management for multiple entities

## Prerequisites

- Node.js (v18 or higher recommended)
- Docker and Docker Compose
- PostgreSQL
- Dragonfly (Redis-compatible cache)

## Project Setup

1. Install dependencies:

```bash
$ npm install
```

2. Environment Setup:
   Create a `.env` file in the root directory with:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
JWT_AT_SECRET="your-access-token-secret"
JWT_RT_SECRET="your-refresh-token-secret"
DRAGONFLY_URL="redis://localhost:6379"
NODE_ENV="development"  # Use "production" for production environment
```

3. Docker Services:

```bash
# Start all services
$ docker-compose up -d

# Services included:
- PostgreSQL (dev-db)
- PostgreSQL (test-db)
- Dragonfly Cache Server
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Management

```bash
# Restart database (removes data)
$ npm run db:dev:restart

# Generate Prisma client
$ npx prisma generate

# Create new migration
$ npx prisma migrate dev

# Apply migrations
$ npm run prisma:dev:deploy
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## bull module to queue notifications (Randevu hatırlatma bildirimi)

BullMQ < - > NestJS
npm install @nestjs/bull bull redis
npm install @bull-board/api @bull-board/express

Redis'i çalıştır
docker run --name redis -p 6379:6379 -d redis

/v1/api/bull-dashboard (Monitoring)

## Project Structure

```
src/
├── auth/                 # Authentication & authorization
│   ├── strategy/        # JWT strategies (access & refresh)
│   └── guard/           # Auth guards
├── dragonfly/           # Caching service
├── prisma/              # Database schema and migrations
├── utils/
│   └── logger/         # Custom logging service
└── main.ts              # Application entry point
```

## Authentication Flow

1. Access Tokens (short-lived)

   - 50-minute expiration
   - JWT-based
   - Used for API authentication

2. Refresh Tokens (long-lived)

   - 7-day expiration
   - Secure rotation on each use
   - Blacklisted after use
   - Stored in Dragonfly cache

3. Token Security
   - Automatic token blacklisting
   - Protection against token reuse
   - Secure token rotation
   - Cache-based token invalidation

## Logging System

The application includes a custom logging service with:

- Log Levels:

  - INFO: General application information
  - ERROR: Application errors with stack traces
  - WARN: Warning messages
  - DEBUG: Development debugging (dev only)
  - VERBOSE: Detailed information (dev only)

- Features:
  - Colorized console output
  - Context-based logging
  - ISO timestamp formatting
  - Environment-aware logging
  - Stack trace support for errors

## Caching with Dragonfly

The application uses Dragonfly as a Redis-compatible caching layer:

- Fast in-memory caching
- Support for string and JSON data
- Configurable TTL for cache entries
- Used for:
  - Token blacklisting
  - Frequently accessed data
  - Session management

## API Documentation

The API documentation is available via Swagger UI at `/api` when running the application.

## Database Schema

Key entities:

- Users
- Roles
- Categories
- Companies
- Employees
- Services
- ServiceDetails
- Addresses
- Various image entities (UserImage, CompanyImage, etc.)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is [UNLICENSED](LICENSE).
