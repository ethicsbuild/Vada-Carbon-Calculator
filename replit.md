# Carbon Footprint Calculator with Google Routes Integration

A comprehensive carbon footprint calculator application with AI-powered co-pilot and Google Routes API integration for automatic distance and emission calculations.

## Overview

This application helps organizations calculate their carbon emissions across all three scopes (1, 2, and 3) in compliance with the GHG Protocol 2025 standards. The app features an AI co-pilot for guided calculations and Google Routes integration for automatic travel emission calculations.

## Recent Changes (September 17, 2025)

### Google Routes API Integration
- **Added Google Routes API Service**: Complete service integration with distance calculation and emission estimates for different transportation modes
- **Created Location Picker Component**: Smart search component for venues, locations, and addresses with Google Places integration
- **Journey Planner Component**: Advanced component for planning multi-stop business travel with automatic emissions calculation
- **Enhanced Scope 3 Calculations**: Integrated journey planner into Scope 3 business travel calculations with toggle between manual input and smart planning
- **API Routes**: Added comprehensive API endpoints for location search, route calculation, and travel emission calculations

### Features Added
- **Smart Location Search**: Auto-complete search for businesses, venues, and addresses
- **Multiple Transportation Modes**: Support for cars (petrol, diesel, hybrid, electric), flights (domestic/international), trains, buses, motorcycles
- **Automatic Distance Calculation**: Uses Google Routes API to calculate accurate distances between locations
- **Real-time Emission Estimates**: Calculates CO2e emissions automatically based on transport mode and distance
- **Round-trip Support**: Option to calculate round-trip emissions
- **Multi-stop Journeys**: Support for complex business trips with multiple destinations
- **Journey Summary**: Visual summary of total distance and emissions for all planned journeys

## Project Architecture

### Backend Services
- **Carbon Calculator Service**: Core emissions calculation engine with GHG Protocol compliance
- **Google Routes Service**: Integration with Google Routes API for distance and emission calculations
- **AI Co-Pilot Service**: OpenAI-powered assistant for guided carbon footprint calculations
- **Report Generator Service**: Generates GHG Protocol reports, carbon receipts, and CSV exports

### Frontend Components
- **Location Picker**: Smart location search with Google Places integration
- **Journey Planner**: Advanced trip planning with automatic emission calculations
- **Calculation Form**: Enhanced with journey planner integration for Scope 3 calculations
- **Carbon Dashboard**: Visualization of emissions across all scopes
- **AI Co-Pilot Chat**: Interactive guidance through calculation process

### API Integration
- **Google Routes API**: For distance calculation and route optimization
- **Google Places API**: For location search and address validation
- **OpenAI API**: For AI-powered calculation assistance
- **Replit Database**: PostgreSQL for data persistence

## User Preferences

### Development Guidelines
- Always use TypeScript for type safety
- Follow shadcn/ui design system patterns
- Use TanStack Query for API state management
- Implement proper data-testid attributes for all interactive elements
- Follow GHG Protocol 2025 standards for emission calculations
- Use Google Routes API for accurate travel distance calculations
- Ensure proper error handling and loading states

### API Key Management
The application requires the following API keys to be configured as Replit secrets:
- `GOOGLE_ROUTES_API_KEY`: For Google Routes API and Places API access
- `OPENAI_API_KEY`: For AI co-pilot functionality

## Setup Instructions

### Google Routes API Setup
1. Get a Google Cloud API key with the following APIs enabled:
   - Routes API
   - Places API (Text Search)
2. Add the API key to Replit secrets as `GOOGLE_ROUTES_API_KEY`

### Database Setup
Run the following command to push schema changes to the database:
```bash
npm run db:push
```

### Running the Application
The application runs both frontend and backend on port 5000:
```bash
npm run dev
```

## Key Features

### Smart Journey Planning
- Search for any location using Google Places API
- Calculate exact distances using Google Routes API
- Automatic emission calculations for different vehicle types
- Support for round trips and multi-stop journeys
- Real-time CO2e emission estimates

### Transportation Modes Supported
- **Cars**: Petrol, Diesel, Hybrid, Electric (with different emission factors)
- **Flights**: Domestic and International (with appropriate factors)
- **Public Transport**: Trains, Buses
- **Other**: Motorcycles with specific emission factors

### Integration with Carbon Calculator
- Seamless integration with existing Scope 3 calculations
- Toggle between manual input and smart journey planning
- Auto-population of business travel distances
- Visual summary of journey emissions in calculation results

## Current Status
- ✅ Google Routes API service implementation completed
- ✅ Location picker component with search functionality
- ✅ Journey planner with multi-modal transport support
- ✅ Integration with existing carbon calculator (Scope 3)
- ✅ API routes for all Routes functionality
- 🔄 API key management documentation (completed)
- ⏳ Integration testing with sample locations (pending)

The Google Routes integration significantly enhances the user experience by automatically calculating accurate travel distances and emissions, making it much easier for organizations to complete comprehensive Scope 3 calculations.