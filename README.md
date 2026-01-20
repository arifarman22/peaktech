# PeakTech eCommerce - Decoupled Architecture

This repository contains the decoupled version of the PeakTech eCommerce application, separated into independent Frontend and Backend services.

## 📁 Project Structure

```
.
├── frontend/           # Next.js 14+ Application (Client)
│   ├── app/           # Pages and API routes (Client-side)
│   ├── components/    # UI Components
│   └── lib/           # Contexts and Utilities
├── backend/            # Express.js Server (API)
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Middleware and helpers
└── README.md           # This file
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB (Running locally or via Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
# Ensure you have the same environment variables as the frontend
npm start # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure NEXT_PUBLIC_API_URL=http://localhost:5000/api in .env.local
npm run dev # Runs on http://localhost:3000
```

## 🔑 Key Changes
- **Architecture**: Switched from monolithic Next.js to Decoupled Frontend/Backend.
- **API**: Separate Express server handles all business logic, models, and DB operations.
- **Authentication**: JWT tokens are now managed via headers and `localStorage` on the frontend.
- **Organization**: Clean separation of folder concerns allows for independent scaling.

## 📄 Documentation
- [Frontend README](frontend/README.md)
- [Backend Source](backend/src)
