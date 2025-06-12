# TravelWise

A scalable, modular travel management platform built using **NestJS** microservices. TravelWise enables users to manage bookings, authenticate via various providers, and enjoy personalized features like frequent user perks — with more services (like email notifications) coming soon.

---

## Overview

TravelWise is composed of several services working together in a microservices architecture. It is designed with separation of concerns, allowing each domain (auth, bookings, frequent users and emais) to evolve independently and scale as needed.

---

## Services

- **API Gateway**  
  Central entry point for client interactions. Handles routing, authentication, and request delegation to microservices.

  Includes:

  - Local and JWT authentication strategies
  - Custom Guards, Interceptors, and Exception Filters

- **Auth Service**  
  Handles:

  - User registration and login
  - Password hashing with `bcrypt`
  - JWT creation and verification

- **Frequent Users Service**  
  Allows:

  - Retrieval of all or a single user.
  - User modification.
  - User deletion.

- **Email Service**  
  Handles all outgoing email notifications related to user activity. Uses Nodemailer to send automated messages triggered by a Service.

  Includes:

  - Welcome email after successful registration
  - Temporary password email for login recovery
  - Account update confirmation emails
  - Account blocked notifications after multiple failed login attempts

- **Bookings Service**  
  Handles all the steps in the booking process.

  Includes:

  - Availability search with airport codes.

---

## Tech Stack

### Core Framework

- **NestJS** — a progressive Node.js framework for building efficient, scalable applications using TypeScript and Express under the hood.

### Authentication

- `passport-local`, `passport-jwt` — local and token-based strategies
- `@nestjs/jwt` — JWT generation and validation

### Emails

- Nodemailer — used for sending transactional emails (welcome messages, password recovery, account updates, and security alerts)
- Gmail SMTP — configured as the email provider
- .env variables — securely manage credentials for email transport configuration
- Centralized NodemailerService injected into feature modules (e.g., Auth)

### Security

- `bcrypt` — password hashing
- `cookie-parser` — reading and writing cookies (used in login/logout flows)
- `crypto` - email encryption and hashing

### Inter-service Communication

- `@nestjs/microservices` — message-based communication between services over TCP.

### Database

- **Prisma ORM** with PostgreSQL — used in `auth`, `bookings`, and `frequent-users` services.
- **Redis** - used in the `bookings` service to cache data entered during booking process.

## Architecture

### Monorepo Structure

Each service lives in its own folder within the repository:

- /api-gateway
- /auth
- /frequent-users
- /bookings
- /emails

### Communication

Microservices communicate using **NestJS transport layers**, enabling **loose coupling**. The API Gateway acts as the **entry point**, delegating requests to internal services.

### Authentication Flow

1. User logs in via the local strategy.
2. API Gateway creates a signed JWT and sends it via an HTTP-only cookie
3. Subsequent requests include the cookie; the Gateway validates the token via JWT strategy and sets `req.user`
4. User is authorized through custom guards

---

## What's to come.

The TravelWise platform is actively evolving. Upcoming features and enhancements include:

-- Enhanced Authentication

Integration of Passport strategies for:

GitHub login

Google login

-- Booking Events

Confirmation email when a booking is created

Notification for booking updates

Cancellation email

-- Inter-service Communication

Transition to RabbitMQ for asynchronous messaging between microservices
(ensuring better scalability and fault tolerance)

-- Smart Booking Options (Concept in Progress)

The Bookings service will allow users to input an origin and destination (via address or airport). Based on the distance, the system will suggest:

Car trips

Train journeys

Flights

To achieve this, it will integrate with Google Maps APIs:

Places API — to get latitude and longitude from location names

Distance Matrix API — to calculate distances and travel durations

This module is still under active design and development.
