import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { AuthenticatedWebSocket, AuthPayload, Message, ActiveUser } from '../types';
import { rooms, addUserToRoom, removeUserFromRoom } from './roomController';
import config from '../utils/config';
import { setUserOffline, setUserOnline } from './friendsControllers';
import { createNotification } from './notificationsController';

const activeUsers = new Map<string, ActiveUser>();

export const setupWebSocketServer = (server: Server): WebSocketServer => {
  const wss = new WebSocketServer({ server });
  console.log('🔌 WebSocket server initialized');

  wss.on('connection', (ws: WebSocket) => {
    const authWs = ws as AuthenticatedWebSocket;
    authWs.isAlive = true;
    console.log('👤 New WebSocket connection');

    authWs.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleWebSocketMessage(authWs, message, wss);
      } catch (error) {
        console.error('❌ Error parsing message:', error);
        sendError(authWs, 'Invalid message format');
      }
    });

    authWs.on('pong', () => {
      authWs.isAlive = true;
    });

    authWs.on('close', () => {
      handleDisconnect(authWs, wss);
    });

    authWs.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });
  });

  // Heartbeat to detect broken connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const authWs = ws as AuthenticatedWebSocket;
      if (authWs.isAlive === false) {
        console.log(`💀 Terminating dead connection: ${authWs.username || 'unknown'}`);
        return authWs.terminate();
      }
      authWs.isAlive = false;
      authWs.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
};

const handleWebSocketMessage = (ws: AuthenticatedWebSocket, message: any, wss: WebSocketServer): void => {
  switch (message.type) {
    case 'auth':
      handleAuth(ws, message, wss);
      break;
    case 'join-room':
      handleJoinRoom(ws, message.payload, wss);
      break;
    case 'leave-room':
      handleLeaveRoom(ws, wss);
      break;
    case 'send-message':
      handleSendMessage(ws, message.payload, wss);
      break;
    case 'typing':
      handleTyping(ws, wss);
      break;
    case 'stop-typing':
      handleStopTyping(ws, wss);
      break;
    // NEW: Direct messaging
    case 'dm':
      handleDirectMessage(ws, message, wss);
      break;
    case 'dm-typing':
      handleDMTyping(ws, message, wss);
      break;
    default:
      console.log('⚠️ Unknown message type:', message.type);
      sendError(ws, 'Unknown message type');
  }
};

const handleAuth = (ws: AuthenticatedWebSocket, message: any, wss: WebSocketServer): void => {
  try {
    const { token } = message;
    if (!token) {
      sendMessage(ws, 'auth-error', { error: 'Token required' });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    ws.username = decoded.username;
    ws.identifier = decoded.identifier;
    ws.currentRoom = null;

    activeUsers.set(ws.identifier, {
      username: ws.username,
      identifier: ws.identifier,
      currentRoom: null,
      ws,
    });

    // Set user online
    setUserOnline(ws.identifier);

    sendMessage(ws, 'auth-success', { 
      username: ws.username, 
      identifier: ws.identifier,
      message: 'Authenticated successfully' 
    });

    // Broadcast online status to all connected users
    broadcastStatusChange(ws.identifier, true, wss);

    console.log(`✅ User authenticated: ${ws.username} (${ws.identifier})`);
  } catch (error) {
    console.error('❌ Auth error:', error);
    sendMessage(ws, 'auth-error', { error: 'Invalid token' });
  }
};

const handleJoinRoom = (ws: AuthenticatedWebSocket, payload: { roomId: string }, wss: WebSocketServer): void => {
  if (!ws.username) {
    sendError(ws, 'Not authenticated');
    return;
  }

  const { roomId } = payload;
  const user = activeUsers.get(ws.identifier);
  if (!user) return;

  if (user.currentRoom) {
    const oldRoom = removeUserFromRoom(user.currentRoom, ws.username);
    if (oldRoom) {
      broadcastToRoom(user.currentRoom, 'user-left', { username: ws.username, userCount: oldRoom.users.size }, wss);
    }
  }

  const room = addUserToRoom(roomId, ws.username);
  if (!room) {
    sendError(ws, 'Room not found');
    return;
  }

  user.currentRoom = roomId;
  ws.currentRoom = roomId;

  sendMessage(ws, 'room-history', room.messages);
  sendMessage(ws, 'room-users', Array.from(room.users));
  broadcastToRoom(roomId, 'user-joined', { username: ws.username, userCount: room.users.size }, wss, ws);

  console.log(`🚪 ${ws.username} joined room: ${roomId}`);
};

const handleLeaveRoom = (ws: AuthenticatedWebSocket, wss: WebSocketServer): void => {
  if (!ws.username || !ws.currentRoom) return;

  const room = removeUserFromRoom(ws.currentRoom, ws.username);
  if (room) {
    broadcastToRoom(ws.currentRoom, 'user-left', { username: ws.username, userCount: room.users.size }, wss);
  }

  const user = activeUsers.get(ws.identifier);
  if (user) {
    user.currentRoom = null;
  }

  ws.currentRoom = null;
  console.log(`🚪 ${ws.username} left room`);
};

const handleSendMessage = (ws: AuthenticatedWebSocket, payload: { text: string }, wss: WebSocketServer): void => {
  if (!ws.username || !ws.currentRoom) {
    sendError(ws, 'Not in a room');
    return;
  }

  const { text } = payload;
  if (!text || text.trim().length === 0) {
    sendError(ws, 'Message cannot be empty');
    return;
  }

  const room = rooms.get(ws.currentRoom);
  if (!room) return;

  const message: Message = {
    username: ws.username,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  room.messages.push(message);
  if (room.messages.length > 100) {
    room.messages.shift();
  }

  broadcastToRoom(ws.currentRoom, 'new-message', message, wss);
  
  // Create notification for users not in this room
  room.users.forEach((username) => {
    if (username !== ws.username) {
      const userEntry = Array.from(activeUsers.values()).find(u => u.username === username);
      if (userEntry && userEntry.currentRoom !== ws.currentRoom) {
        createNotification(
          userEntry.identifier,
          'message',
          ws.username,
          `New message in ${ws.currentRoom}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`
        );
      }
    }
  });

  console.log(`💬 ${ws.username} in ${ws.currentRoom}: ${text}`);
};

// NEW: Handle Direct Messages
const handleDirectMessage = (ws: AuthenticatedWebSocket, message: any, _wss: WebSocketServer): void => {
  if (!ws.identifier) {
    sendError(ws, 'Not authenticated');
    return;
  }

  const { to, text, messageId, timestamp } = message;

  if (!to || !text) {
    sendError(ws, 'Recipient and message required');
    return;
  }

  console.log(`📨 DM: ${ws.identifier} → ${to}: "${text}"`);

  // Find recipient
  const recipient = activeUsers.get(to);

  if (recipient && recipient.ws.readyState === WebSocket.OPEN) {
    // Recipient is online - send immediately
    sendMessage(recipient.ws, 'new-dm', {
      from: ws.identifier,
      fromUsername: ws.username,
      to,
      text,
      messageId,
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`✅ DM delivered to ${to}`);

    // Send delivery confirmation to sender
    sendMessage(ws, 'dm-delivered', {
      messageId,
      to,
      delivered: true,
    });
  } else {
    // Recipient is offline
    console.log(`⚠️ Recipient ${to} is offline`);

    // Create notification
    createNotification(
      to,
      'message',
      ws.identifier,
      `New message from ${ws.username}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`
    );

    // Send delivery status to sender
    sendMessage(ws, 'dm-delivered', {
      messageId,
      to,
      delivered: false,
      offline: true,
    });
  }
};

// NEW: Handle DM Typing Indicator
const handleDMTyping = (ws: AuthenticatedWebSocket, message: any, _wss: WebSocketServer): void => {
  if (!ws.identifier) return;

  const { to, isTyping } = message;

  const recipient = activeUsers.get(to);
  if (recipient && recipient.ws.readyState === WebSocket.OPEN) {
    sendMessage(recipient.ws, 'dm-typing', {
      from: ws.identifier,
      fromUsername: ws.username,
      isTyping,
    });
  }
};

const handleTyping = (ws: AuthenticatedWebSocket, wss: WebSocketServer): void => {
  if (!ws.username || !ws.currentRoom) return;
  broadcastToRoom(ws.currentRoom, 'user-typing', { username: ws.username }, wss, ws);
};

const handleStopTyping = (ws: AuthenticatedWebSocket, wss: WebSocketServer): void => {
  if (!ws.username || !ws.currentRoom) return;
  broadcastToRoom(ws.currentRoom, 'user-stop-typing', { username: ws.username }, wss, ws);
};

const handleDisconnect = (ws: AuthenticatedWebSocket, wss: WebSocketServer): void => {
  if (!ws.username) return;
  console.log(`👋 ${ws.username} disconnected`);

  if (ws.currentRoom) {
    const room = removeUserFromRoom(ws.currentRoom, ws.username);
    if (room) {
      broadcastToRoom(ws.currentRoom, 'user-left', { username: ws.username, userCount: room.users.size }, wss);
    }
  }

  // Set user offline
  if (ws.identifier) {
    setUserOffline(ws.identifier);
    
    // Broadcast offline status to all connected users
    broadcastStatusChange(ws.identifier, false, wss);
    
    activeUsers.delete(ws.identifier);
  }
};

// NEW: Broadcast status changes
const broadcastStatusChange = (userId: string, isOnline: boolean, wss: WebSocketServer): void => {
  const statusMessage = {
    type: 'status-change',
    userId,
    isOnline,
    timestamp: new Date().toISOString(),
  };

  wss.clients.forEach((client) => {
    const authClient = client as AuthenticatedWebSocket;
    if (authClient.readyState === WebSocket.OPEN && authClient.identifier !== userId) {
      authClient.send(JSON.stringify(statusMessage));
    }
  });

  console.log(`📢 Broadcasted: ${userId} is ${isOnline ? 'online' : 'offline'}`);
};

const sendMessage = (ws: AuthenticatedWebSocket, type: string, payload?: any): void => {
  if (ws.readyState === WebSocket.OPEN) {
    const message = { type, payload, timestamp: new Date().toISOString() };
    ws.send(JSON.stringify(message));
  }
};

const sendError = (ws: AuthenticatedWebSocket, error: string): void => {
  sendMessage(ws, 'error', { error });
};

const broadcastToRoom = (
  roomId: string,
  type: string,
  payload: any,
  wss: WebSocketServer,
  exclude?: AuthenticatedWebSocket
): void => {
  wss.clients.forEach((client) => {
    const authClient = client as AuthenticatedWebSocket;
    if (authClient.readyState === WebSocket.OPEN && authClient.currentRoom === roomId && authClient !== exclude) {
      sendMessage(authClient, type, payload);
    }
  });
};

// Export activeUsers for debugging
export { activeUsers };