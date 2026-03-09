import express, { Express } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';

import config from './utils/config';
import { authenticateToken } from './middleware/auth';

// Auth
import {
  register,
  verifyRegistrationOTP,
  login,
  resendOTP,
  logout,
  verify,
  getAllUsers,
} from './controllers/authController';

// Rooms
import { getRooms, createRoom } from './controllers/roomController';

// Friends
import { getFriends, addFriend } from './controllers/friendsControllers'; // Fixed typo: friendsControllers → friendsController

// Notifications
import { getNotifications, markAsRead } from './controllers/notificationsController';

// Direct Messages
import {
  getConversations,
  getDirectMessages,
  sendDirectMessage,
  markDMAsRead,
} from './controllers/dmController';

// Profile (Updated)
import {
  getProfile,
  getUserProfile, // Added separate function
  updateProfile,
  updateStatus,
} from './controllers/profileController';

// User Search
import { searchUsers } from './controllers/authController'; // Moved to authController

// Messages
import {
  getMessages,
  sendMessage,
  createConversation,
  addReaction,
  deleteMessage,
} from './controllers/messageController';

// Groups
import {
  createGroup,
  getGroups,
  addMember,
  removeMember,
  leaveGroup,
} from './controllers/groupController';

// WebSocket
import { setupWebSocketServer } from './controllers/wsController';

const app: Express = express();
const server = http.createServer(app);

/* ================== MIDDLEWARE ================== */

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

app.post('/api/register', register);
app.post('/api/verify-registration', verifyRegistrationOTP);
app.post('/api/login', login);
app.post('/api/resend-registration-otp', resendOTP);
app.post('/api/logout', logout);
app.get('/api/verify', authenticateToken, verify);

/* ================== ROOM ROUTES ================== */

app.get('/api/rooms', authenticateToken, getRooms);
app.post('/api/rooms', authenticateToken, createRoom);

/* ================== FRIEND ROUTES ================== */

app.get('/api/friends', authenticateToken, getFriends);
app.post('/api/friends/add', authenticateToken, addFriend);

/* ================== NOTIFICATION ROUTES ================== */

app.get('/api/notifications', authenticateToken, getNotifications);
app.post('/api/notifications/read', authenticateToken, markAsRead);

/* ================== DIRECT MESSAGE ROUTES ================== */

app.get('/api/dm/conversations', authenticateToken, getConversations);
app.get('/api/dm/messages/:otherUserId', authenticateToken, getDirectMessages);
app.post('/api/dm/send', authenticateToken, sendDirectMessage);
app.post('/api/dm/read', authenticateToken, markDMAsRead);

/* ================== PROFILE ROUTES (UPDATED) ================== */

app.get('/api/profile', authenticateToken, getProfile); // Get own profile
app.get('/api/profile/:userId', authenticateToken, getUserProfile); // Get user profile by ID
app.put('/api/profile', authenticateToken, updateProfile); // Update profile (including picture)
app.patch('/api/profile/status', authenticateToken, updateStatus); // Update status only

/* ================== USER SEARCH ================== */

app.get('/api/users/search', authenticateToken, searchUsers);

/* ================== MESSAGE ROUTES ================== */

app.get('/api/conversations/:conversationId/messages', authenticateToken, getMessages);
app.post('/api/conversations', authenticateToken, createConversation);
app.post('/api/messages/send', authenticateToken, sendMessage);
app.post('/api/messages/read', authenticateToken, markDMAsRead);
app.post('/api/messages/react', authenticateToken, addReaction);
app.delete('/api/messages/delete', authenticateToken, deleteMessage);

/* ================== GROUP ROUTES ================== */

app.post('/api/groups', authenticateToken, createGroup);
app.get('/api/groups', authenticateToken, getGroups);
app.post('/api/groups/add-member', authenticateToken, addMember);
app.post('/api/groups/remove-member', authenticateToken, removeMember);
app.post('/api/groups/leave', authenticateToken, leaveGroup);

/* ================== ADMIN ROUTE ================== */

app.get('/api/users', authenticateToken, getAllUsers);

/* ================== WEBSOCKET ================== */

setupWebSocketServer(server);

/* ================== SERVER START WITH DB CONNECTION ================== */

const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');

    await mongoose.connect(config.MONGO_URI);

    console.log('✅ MongoDB Connected Successfully');

    server.listen(config.PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`📡 Server running on http://localhost:${config.PORT}`);
      console.log(`🔌 WebSocket running on ws://localhost:${config.PORT}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
      console.log('🎨 Profile Pictures: Enabled (Base64, max 10MB)');
      console.log('🚀 ========================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

startServer();

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