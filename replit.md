# CarbonCoPilot

## Overview

CarbonCoPilot is an AI-powered carbon footprint calculation platform that provides GHG Protocol 2025 compliant emissions calculations with conversational AI guidance. The application features a React frontend with Express.js backend, PostgreSQL database via Drizzle ORM, and blockchain-ready architecture for carbon receipt verification. Key capabilities include Scope 1, 2, and 3 emissions calculations, intelligent data estimation, progress tracking with gamification elements, and comprehensive reporting with export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for calculator, dashboard, reports, and home
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with Tailwind CSS using shadcn/ui component system
- **Styling**: Tailwind CSS with custom CSS variables for theming and Inter font family
- **Theme System**: Light/dark mode support with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework using ES modules
- **API Design**: RESTful API with organized route handlers for users, organizations, calculations, and AI conversations
- **Middleware**: Request logging, error handling, and JSON/URL-encoded body parsing
- **Development Setup**: Vite integration for development with HMR and static file serving

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL via Neon serverless with WebSocket support
- **Schema**: Comprehensive schema covering users, organizations, carbon calculations, AI conversations, reports, achievements, and emission factors
- **Migration**: Drizzle Kit for schema migrations with output to migrations directory

### Carbon Calculation Engine
- **Compliance**: GHG Protocol 2025 standards with Scope 1, 2, and 3 calculations
- **Methods**: Multiple calculation approaches (guided, estimation, detailed) based on user preference and data availability
- **Emission Factors**: Built-in emission factors library with industry-specific coefficients
- **Data Storage**: JSON-based storage for flexible scope data with decimal precision for emission results

### AI Integration
- **AI Service**: OpenAI GPT integration for conversational carbon footprint guidance
- **Context Management**: Maintains conversation state and user organization context
- **Features**: Intelligent data estimation, context-aware recommendations, and memory of previous interactions
- **Session Management**: Persistent AI conversation sessions linked to user accounts

## External Dependencies

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **Drizzle ORM**: TypeScript ORM for database operations and schema management

### AI and ML Services
- **OpenAI API**: GPT models for conversational AI copilot functionality
- **Model**: Uses GPT-5 (latest model as of August 2025) for advanced carbon calculation guidance

### Third-party Integrations
- **Notion API**: Document and knowledge base integration for organizational data
- **Slack API**: Workspace integration for notifications and collaboration
- **Blockchain Ready**: Architecture prepared for Hedera Guardian integration for carbon receipt NFTs

### Development Tools
- **Vite**: Build tool with React plugin and runtime error overlay
- **TypeScript**: Full TypeScript support with strict configuration
- **ESBuild**: Production build optimization for server bundle
- **Replit Integration**: Development environment integration with cartographer plugin

### UI and Components
- **Radix UI**: Comprehensive primitive components for accessible UI
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Icon library for consistent visual elements
- **React Hook Form**: Form management with Zod validation schemas

### Query and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight routing solution for single-page application navigation