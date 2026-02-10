import express, { Express } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import config from './utils/config';
import { authenticateToken } from './middleware/auth';
import {
  registerWithOTP,
  sendLoginOTP,
  verifyOTPAndLogin,
  resendOTP,
  logout,
  verify,
  getAllUsers,
} from './controllers/otpAuthController';
import { getRooms, createRoom } from './controllers/roomController';
import { setupWebSocketServer } from './controllers/wsController';


const app: Express = express();
const server = http.createServer(app);


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.post('/api/register-otp', registerWithOTP);
app.post('/api/login-otp', sendLoginOTP);
app.post('/api/verify-otp', verifyOTPAndLogin);
app.post('/api/resend-otp', resendOTP);
app.post('/api/logout', logout);
app.get('/api/verify', authenticateToken, verify);


app.get('/api/rooms', authenticateToken, getRooms);
app.post('/api/rooms', authenticateToken, createRoom);

app.get('/api/users', getAllUsers);


setupWebSocketServer(server);


server.listen(config.PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`📡 Server running on http://localhost:${config.PORT}`);
  console.log(`🔌 WebSocket running on ws://localhost:${config.PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log('🚀 ========================================');
  console.log('');
});


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