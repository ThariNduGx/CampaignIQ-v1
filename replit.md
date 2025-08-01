# CampaignIQ

## Overview

CampaignIQ is a unified marketing analytics dashboard that automatically aggregates performance data from Google Ads/Analytics and Meta (Facebook/Instagram) advertising platforms. The application eliminates manual reporting by providing a single dashboard view with AI-powered insights generated through OpenAI integration. Built for SEO specialists, digital marketers, and marketing managers, it enables cross-platform performance comparison and trend analysis with automated OAuth 2.0 connections to external marketing APIs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- React 18+ with TypeScript using Vite as the build tool
- Client-side routing implemented with Wouter for lightweight navigation
- Shadcn/ui component library with Radix UI primitives for accessible UI components
- Tailwind CSS for styling with custom design tokens and dark theme support
- TanStack Query for server state management and data fetching with built-in caching
- Recharts library for data visualization including line charts, bar charts, and performance metrics

**Backend Architecture**
- Express.js server with TypeScript support
- RESTful API architecture with centralized route handling
- Modular service layer for external API integrations (OAuth, OpenAI)
- Comprehensive error handling middleware with request/response logging
- Session-based authentication using express-session with PostgreSQL storage

**Database Design**
- PostgreSQL database with Drizzle ORM for type-safe database operations
- Schema includes users, workspaces, platform connections, campaigns, metrics, and AI insights
- Foreign key relationships maintaining data integrity across entities
- Encrypted storage for OAuth tokens with automatic refresh token handling
- Session management table required for Replit Auth integration

**Authentication & Authorization**
- Replit Auth integration for user authentication using OpenID Connect
- OAuth 2.0 flows for Google (Ads/Analytics) and Meta (Facebook Ads) platform connections
- JWT token management with bcrypt for secure password handling
- Workspace-based access control ensuring users only access their own data

**External API Integration**
- Google APIs: Google Analytics Data API, Google Search Console API, and Google My Business API integration
- Google Ads API integration for campaign performance data (existing framework)
- Meta Business API: Facebook and Instagram Ads API integration (existing framework)
- OpenAI API: GPT-4o model for generating marketing insights and anomaly detection
- Automatic token refresh mechanisms to maintain persistent API connections
- OAuth 2.0 implementation with comprehensive scope management for Google services

**Data Processing & Analytics**
- Campaign metrics aggregation across multiple platforms
- Time-series data handling for performance trend analysis
- AI-powered insight generation providing actionable recommendations
- Real-time dashboard updates with configurable date range filtering

## External Dependencies

**Database & Infrastructure**
- PostgreSQL database for persistent data storage
- Neon serverless PostgreSQL driver for database connectivity
- WebSocket support for real-time database connections

**Authentication Services**
- Replit Auth for user authentication and session management
- OpenID Connect protocol implementation for secure authentication flows

**Marketing Platform APIs**
- Google Ads API for campaign performance data
- Google Analytics API for website traffic and conversion tracking
- Meta Business API for Facebook and Instagram advertising metrics
- OAuth 2.0 client credentials for secure API access

**AI & Analytics Services**
- OpenAI API with GPT-4o model for generating marketing insights
- Natural language processing for campaign performance analysis and recommendations

**Development & Deployment**
- Vercel for production deployment and hosting
- Vite development server with hot module replacement
- ESBuild for production bundling and optimization
- TypeScript for type safety across the entire application stack