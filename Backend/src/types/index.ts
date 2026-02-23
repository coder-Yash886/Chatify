import { WebSocket } from 'ws';

export interface User {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthPayload {
  username: string;
  identifier: string;
}


export interface OTP {
  code: string;
  expiresAt: Date;
  attempts: number;
}

export interface OTPStore {
  [identifier: string]: OTP;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  identifier: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
}


export interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export interface Room {
  name: string;
  users: Set<string>;
  messages: Message[];
}

export interface RoomInfo {
  id: string;
  name: string;
  userCount: number;
}


export interface AuthenticatedWebSocket extends WebSocket {
  username: string;
  identifier: string;
  currentRoom: string | null;
  isAlive: boolean;
}

export type WebSocketMessageType =
  | 'auth'
  | 'auth-success'
  | 'auth-error'
  | 'join-room'
  | 'leave-room'
  | 'room-joined'
  | 'room-history'
  | 'send-message'
  | 'new-message'
  | 'user-joined'
  | 'user-left'
  | 'typing'
  | 'stop-typing'
  | 'user-typing'
  | 'user-stop-typing'
  | 'room-users'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload?: any;
  timestamp?: string;
}


export interface JoinRoomPayload {
  roomId: string;
}

export interface SendMessagePayload {
  text: string;
}

export interface UserJoinedPayload {
  username: string;
  userCount: number;
}

export interface UserLeftPayload {
  username: string;
  userCount: number;
}

export interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  NODE_ENV: string;
}


export interface ActiveUser {
  username: string;
  identifier: string;
  currentRoom: string | null;
  ws: AuthenticatedWebSocket;
}

export interface Friend{
  username:string;
  identifier: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface FriendRequest{
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'friend_accepted' | 'room_invite';
  from: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface DirectMessage{
  id:string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  participants: [string, string];
  lastMessage?: DirectMessage;
  unreadCount: number;
  messages: DirectMessage[];
}


export interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  statusMessage?: string;
  createdAt: Date;
  lastSeen: Date;
}

export interface MessageReaction {
  messageId: string;
  emoji: string;
  users: string[];
}


export interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
  conversationId?: string;
  roomId?: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}