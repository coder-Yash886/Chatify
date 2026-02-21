import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { AuthenticatedWebSocket, AuthPayload, Message, ActiveUser } from '../types';
import { rooms, addUserToRoom, removeUserFromRoom } from './roomController';
import config from '../utils/config';

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
      handleAuth(ws, message.payload, wss);
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
    default:
      sendError(ws, 'Unknown message type');
  }
};

const handleAuth = (ws: AuthenticatedWebSocket, payload: { token: string }, wss: WebSocketServer): void => {
  try {
    const { token } = payload;
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

    sendMessage(ws, 'auth-success', { username: ws.username, message: 'Authenticated successfully' });
    console.log(`✅ User authenticated: ${ws.username}`);
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
  console.log(`💬 ${ws.username} in ${ws.currentRoom}: ${text}`);
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

  activeUsers.delete(ws.identifier);
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