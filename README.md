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

## Features

- Authentication with JWT (Access & Refresh tokens)
- Role-based authorization (Admin, CompanyAdmin, CompanyEmployee, User)
- Database integration with Prisma ORM
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
```

3. Database Setup:
```bash
# Start PostgreSQL container
$ npm run db:dev:up

# Apply migrations
$ npm run prisma:dev:deploy

# Seed the database
$ npx prisma db seed
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

## Project Structure

```
src/
├── auth/                 # Authentication & authorization
├── prisma/              # Database schema and migrations
├── utils/               # Shared utilities
└── main.ts              # Application entry point
```

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
