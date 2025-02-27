# LogU - QR Code Marketing Platform

## Overview
LogU is a comprehensive QR code marketing platform that connects brands with influencers to create, manage, and track marketing campaigns through dynamic QR codes. The platform facilitates seamless collaboration between brands and influencers while providing detailed analytics and campaign performance metrics.

## Features

### For Brands
- Create and manage marketing campaigns
- Generate unique QR codes for influencers
- Track campaign performance in real-time
- View detailed analytics and conversion rates
- Manage influencer applications and collaborations
- Export campaign data and reports

### For Influencers
- Browse and apply to brand campaigns
- Generate personalized QR codes
- Track earnings and performance metrics
- View scan statistics and conversion rates
- Manage multiple campaign participations
- Export performance reports

## Technology Stack

### Frontend
- Next.js 14
- TypeScript
- Styled Components
- Framer Motion
- React Icons
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Sequelize ORM
- JWT Authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/logu.git
cd logu
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logu_mvp
DB_USER=your_username
DB_PASSWORD=your_password
PORT=5001
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3002

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

## API Documentation

The API is organized around REST principles. All endpoints accept JSON request bodies and return JSON responses. All endpoints are prefixed with `/api`.

### Main Endpoints
- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/campaigns` - Campaign operations
- `/api/qrcodes` - QR code generation and management
- `/api/applications` - Campaign applications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/logu](https://github.com/yourusername/logu)
