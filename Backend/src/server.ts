import express, { Express } from 'express';
import http from 'http';
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
import { getFriends } from './controllers/friendsControllers';

// Notifications
import { getNotifications, markAsRead } from './controllers/notificationsController';

// Direct Messages
import { 
  getConversations, 
  getDirectMessages, 
  sendDirectMessage, 
  markDMAsRead 
} from './controllers/dmController';

// Profile
import { 
  getProfile, 
  updateProfile, 
  updateStatus, 
  searchUsers 
} from './controllers/profileController';

// Messages (Advanced)
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
`
/* ================== NOTIFICATION ROUTES ================== */

app.get('/api/notifications', authenticateToken, getNotifications);
app.post('/api/notifications/read', authenticateToken, markAsRead);

/* ================== DIRECT MESSAGE ROUTES ================== */

app.get('/api/dm/conversations', authenticateToken, getConversations);
app.get('/api/dm/messages/:otherUserId', authenticateToken, getDirectMessages);
app.post('/api/dm/send', authenticateToken, sendDirectMessage);
app.post('/api/dm/read', authenticateToken, markDMAsRead);

/* ================== PROFILE ROUTES ================== */

app.get('/api/profile/:userId?', authenticateToken, getProfile);
app.put('/api/profile', authenticateToken, updateProfile);
app.patch('/api/profile/status', authenticateToken, updateStatus);
app.get('/api/users/search', authenticateToken, searchUsers);

/* ================== MESSAGE/CONVERSATION ROUTES ================== */

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