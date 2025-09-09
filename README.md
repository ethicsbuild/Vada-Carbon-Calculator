# CarbonCoPilot  
AI-powered carbon footprint calculator

## Overview
CarbonCoPilot helps individuals and organizations measure, understand, and reduce their carbon footprint.  
It combines:
- **AI-driven analysis** of activity and consumption data  
- **PostgreSQL/Supabase backend** for structured data storage  
- **Interactive interface** (Replit + web front-end) for real-time calculation and visualization  

## Features
- Track emissions across categories (transportation, energy, food, events)  
- AI-assisted insights and recommendations for reduction  
- Secure storage of user data in a PostgreSQL database  
- Extensible API layer for future integrations (e.g. Hedera, DAO governance)  

## Tech Stack
- **Frontend**: Replit-hosted Node.js/React (if you’re running UI here)  
- **Backend**: Node.js/Express (or FastAPI if Python backend in use)  
- **Database**: PostgreSQL via Supabase  
- **AI Layer**: OpenAI GPT-5 API calls for reasoning/estimates  
- **Deployment**: GitHub + Replit (with Vercel/Netlify optional in roadmap)  

## Getting Started

### Prerequisites
- Node.js 18+ (if using the Node stack)  
- PostgreSQL (local or via Supabase)  
- Git + GitHub account  

### Installation
```bash
git clone https://github.com/ethicsbuild/Vada-Carbon-Calculator.git
cd Vada-Carbon-Calculator
npm install   # or pip install -r requirements.txt if Python
