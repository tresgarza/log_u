# LogU MVP V2

## Overview

LogU is a platform for connecting brands with influencers, managing marketing campaigns, verifying codes at points of sale, and automating payments. This repository contains the MVP V2 codebase, developed with a full-code approach for maximum flexibility, scalability, and robustness.

## Project Structure

- `/frontend`: React/Next.js based web application
- `/backend`: Node.js/Express based REST API
- `/docs`: Documentation for the project

## Key Features

1. **Captación de Marcas e Influencers**
   - Registration forms
   - Internal CRM for lead tracking and qualification
   - Basic communication and validation automations

2. **Onboarding**
   - Profile creation and management (brand and influencer)
   - Data validation
   - Knowledge base for guidance
   - Automated email communications

3. **Campaign Management**
   - Campaign creation and influencer assignment
   - Generation of unique codes per campaign and influencer
   - Dashboard for tracking purchases/conversions

4. **Code Verification at Point of Sale (POS)**
   - Interface for merchants to enter/verify codes
   - Transaction recording in the database
   - Automated notifications to influencers

5. **Monitoring and Payments**
   - Administrative dashboard with campaign metrics
   - Pending payments to influencers
   - Payment automation
   - End-of-campaign notifications and payment settlement

## Development Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Database Setup

```bash
# Configure your database connection in backend/.env
# Then run migrations
cd backend
npm run migrate
```

## Development Roadmap

The project development is organized into 5 phases, each spanning 2 weeks:

1. **Infrastructure and Lead Capture** (Weeks 1-2)
2. **Onboarding and Profiles** (Weeks 3-4)
3. **Campaign Management** (Weeks 5-6)
4. **Code Validation at Point of Sale** (Weeks 7-8)
5. **Monitoring, Payments, and Launch** (Weeks 9-10)

## Contributing

Please follow the Git Flow branching strategy:
- `main`: Production code
- `develop`: Development branch
- `feature/*`: For new features
- `release/*`: For release preparations
- `hotfix/*`: For urgent fixes

## License

Proprietary. All rights reserved. 