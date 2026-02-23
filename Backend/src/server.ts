import express, { Express } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
//import { getConversations, getMessages, sendDirectMessage, markAsRead as markDMAsRead } from './controllers/dmController';
//import { getProfile, updateProfile, updateStatus, searchUsers } from './controllers/profileController';
import config from './utils/config';
import { authenticateToken } from './middleware/auth';

import {
  register,
  verifyRegistrationOTP,
  login,
  resendOTP,
  logout,
  verify,
  getAllUsers,
} from './controllers/authController';

import { getRooms, createRoom } from './controllers/roomController';
import { setupWebSocketServer } from './controllers/wsController';

const app: Express = express();
const server = http.createServer(app);


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

/* ================== HEALTH CHECK ================== */

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/* ================== AUTH ROUTES ================== */

app.post('/api/auth/register', register);
app.post('/api/auth/verify-otp', verifyRegistrationOTP);
app.post('/api/auth/login', login);
app.post('/api/auth/resend-otp', resendOTP);
app.post('/api/auth/logout', logout);
app.get('/api/auth/verify', authenticateToken, verify);

/* ================== ROOM ROUTES ================== */

app.get('/api/rooms', authenticateToken, getRooms);
app.post('/api/rooms', authenticateToken, createRoom);

/* ================== ADMIN ROUTE ================== */

app.get('/api/users', authenticateToken, getAllUsers);

/* ================== WEBSOCKET ================== */

setupWebSocketServer(server);

/* ================== SERVER START ================== */

server.listen(config.PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`📡 Server running on http://localhost:${config.PORT}`);
  console.log(`🔌 WebSocket running on ws://localhost:${config.PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log('🚀 ========================================');
  console.log('');
});

/* ================== GRACEFUL SHUTDOWN ================== */

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;