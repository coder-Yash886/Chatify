# Chatify - Real-Time Chat Application

A modern, full-stack chat application built with React, TypeScript, Express, and WebSocket for instant messaging.

## 🚀 Features

- **Real-time messaging** with WebSocket
- **User authentication** with JWT and OTP verification
- **Direct messaging** between users
- **Friend management** system
- **Message replies** and reactions
- **Image sharing** support
- **Online/offline status** tracking
- **Read receipts** for messages
- **User blocking** functionality
- **Dark theme** UI with smooth animations

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 4.0
- React Router
- Axios
- Lucide React (icons)
- Date-fns

### Backend
- Node.js + Express 5.x
- TypeScript
- WebSocket (ws)
- MongoDB + Mongoose
- JWT authentication
- Nodemailer (OTP emails)
- Bcrypt.js

## 📁 Project Structure

```
Chatify/
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # MongoDB models
│   │   ├── middleware/       # Auth middleware
│   │   └── utils/            # Config & utilities
│   ├── .env
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── pages/            # Main pages
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── api/              # API calls
│   ├── .env
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account (for OTP emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
MONGODB_URI=mongodb://localhost:27017/chatify
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Gmail address for sending OTPs
- `EMAIL_PASSWORD` - Gmail app password
- `MONGODB_URI` - MongoDB connection string

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket server URL

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/verify-registration` - Verify OTP
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/verify` - Verify JWT token

### Friends
- `GET /api/friends` - Get friend list
- `POST /api/friends/add` - Send friend request

### Messages
- `GET /api/dm/conversations` - Get all conversations
- `GET /api/dm/messages/:userId` - Get messages with user
- `POST /api/dm/send` - Send message
- `POST /api/dm/read` - Mark messages as read

### User
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `PATCH /api/profile/status` - Update online status

### Blocking
- `POST /api/block` - Block user
- `POST /api/unblock` - Unblock user
- `GET /api/blocked-users` - Get blocked users list

## 🌐 WebSocket Events

### Client → Server
- `auth` - Authenticate connection
- `dm` - Send direct message
- `dm-typing` - Typing indicator

### Server → Client
- `auth-success` - Authentication successful
- `new-dm` - New message received
- `dm-delivered` - Message delivery confirmation
- `status-change` - User online/offline status

## 🎨 Key Features Explained

### Real-time Messaging
- WebSocket connection for instant message delivery
- Message delivery confirmations
- Read receipts
- Typing indicators

### Authentication
- JWT-based authentication
- OTP verification via email
- Session management
- Protected routes

### User Interface
- Clean, modern design with Tailwind CSS
- Dark theme with purple/pink gradients
- Smooth animations and transitions
- Responsive layout for all devices
- Message grouping by date

