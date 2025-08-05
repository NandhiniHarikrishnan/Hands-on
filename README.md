# CRM System

A full-stack CRM system with React (Vite) frontend and Node.js/Express/TypeORM backend. Features include authentication, customer management, sales leads, tasks, contact history, and reporting.

## Features

- User authentication (register, login, JWT-based session)
- Auto-logout after 5 minutes of inactivity
- CRUD operations for:
  - Customers
  - Sales Leads
  - Tasks
  - Contact History
- Dashboard and Reports

## Tech Stack

- **Frontend:** React, Vite, Context API, React Router
- **Backend:** Node.js, Express, TypeORM
- **Database:** MySQL
- **Authentication:** JWT (5-minute expiration)

## Getting Started

### Prerequisites
- Node.js
- MySQL database

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure MySQL connection in `src/data-source.ts`.
3. Start the backend server:
   ```bash
   npm run start
   ```
   The server runs on `http://localhost:3001` by default.

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default.

## API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get user profile
- `GET /api/health` — Health check
- CRUD endpoints for customers, sales leads, tasks, contact history (all under `/api/`)

## Project Structure

```
backend/
  src/
    entities/         # TypeORM models
    routes/           # Express routes
    middleware/       # Auth logic
    server.ts         # Main server file
frontend/
  src/
    components/       # React UI components
    context/          # Auth context
    services/         # API calls
    types/            # TypeScript types
```

## License
MIT
