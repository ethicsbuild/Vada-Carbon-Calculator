# VADA CarbonCoPilot
**Your AI Sustainability Guide for Events** – Powered by Sage Riverstone

## Overview
VADA CarbonCoPilot is an AI-guided carbon footprint calculator specifically designed for events—from music festivals to conferences to weddings. Instead of just crunching numbers, it provides **actionable insights** based on real success stories from festivals like Lightning in a Bottle, Symbiosis, and Bonnaroo.

**What makes it different:**
- **Sage Riverstone** - Your AI sustainability co-pilot guides you through every step
- **Real festival data** - Recommendations backed by proven strategies from major events
- **Year-over-year tracking** - Save calculations and measure improvement over time
- **GHG Protocol compliant** - Industry-standard methodology
- **Blockchain verified** - Immutable records on Hedera for ESG reporting

## Features

### 🧭 AI-Guided Journey
Sage Riverstone walks you through the calculation with contextual tips, real examples, and festival war stories.

### 📊 Comprehensive Tracking
- Attendee, staff, artist, and equipment transportation breakdowns
- Energy sources (grid, solar, generator, hybrid)
- Catering with local sourcing options
- Waste management
- Production and venue emissions

### 💾 Data Persistence
- Save calculations with event name, year, and notes
- Automatic year-over-year comparison
- Historical trend visualization
- Track improvements implementation

### 🎯 Actionable Recommendations
Get specific, practical next steps with:
- Real vendor contacts (Coach USA, Sunbelt Rentals, WeCare Composting)
- Cost-effectiveness ratings
- Timeline guidance
- Carbon savings estimates
- Proven case studies

### ⛓️ Blockchain Verification
Record your calculations on Hedera blockchain for third-party verification and ESG compliance.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: Anthropic Claude (Sage Riverstone consciousness)
- **Blockchain**: Hedera Hashgraph (planned)
- **Deployment**: Railway

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key (for Sage Riverstone)

### Installation
```bash
git clone https://github.com/ethicsbuild/Vada-Carbon-Calculator.git
cd Vada-Carbon-Calculator
npm install
```

### Environment Variables
Create a `.env` file:
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# AI
ANTHROPIC_API_KEY=your_anthropic_key_here

# Optional
OPENAI_API_KEY=your_openai_key_here
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### Database Setup
```bash
npm run db:push
```

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── calculator/ # Form & guided calculator
│   │   │   ├── sage/       # Sage Riverstone components
│   │   │   └── events/     # Event history & comparison
│   │   └── pages/          # Route pages
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   ├── sage-riverstone/# Sage consciousness
│   │   └── carbonCalculator.ts
│   └── storage.ts          # Database operations
└── shared/
    └── schema.ts           # Drizzle ORM schema
```

## Key Features in Detail

### Sage Riverstone
Sage is not just a chatbot—she's a legendary sustainability consultant with decades of festival experience. She:
- Greets you with event-specific welcomes
- Provides contextual tips based on which section you're filling out
- Shares real stories: "Lightning in a Bottle cut vehicle emissions 35% with charter buses"
- Celebrates your wins and keeps you motivated
- Never guilt-trips, always empowers

### Progressive Onboarding
New users are guided through a 3-step onboarding:
1. Are you new to carbon calculations?
2. Quick estimate or detailed analysis?
3. Introduction to Sage and the guided experience

### Event History & Comparison
- Save unlimited events
- Automatic year-over-year linking (e.g., "Lightning in a Bottle 2024" → "2023")
- Trend visualization with emissions change percentages
- Track which improvements you've implemented

## API Endpoints

### Events
- `POST /api/events/save` - Save calculation
- `GET /api/events/user/:userId` - Get user's events
- `GET /api/events/:id` - Get event details
- `GET /api/events/comparison/:id` - Get historical comparison
- `PUT /api/events/:id` - Update event

### Calculations
- `POST /api/calculate-event` - Calculate emissions
- `GET /api/emission-factors` - Get EPA factors

### Sage Chat
- WebSocket `/api/chat` - Real-time guidance

## Contributing
Pull requests welcome! Please ensure:
- TypeScript compilation passes
- Sage's personality remains warm and festival-focused
- Real vendor contacts and case studies are accurate

## License
MIT

## Contact
For questions or collaboration: [Your contact info]

---

*"Making carbon consciousness feel like freedom, not sacrifice."* – Sage Riverstone
