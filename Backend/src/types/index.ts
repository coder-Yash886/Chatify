import { WebSocket } from 'ws';

// ==================== User Types ====================

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

// ==================== OTP Types ====================

export interface OTP {
  code: string;
  expiresAt: Date;
  attempts: number;
}

export interface OTPStore {
  [identifier: string]: OTP;
}

// ==================== Auth Request/Response Types ====================

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

// ==================== Message Types ====================

export interface Message {
  username: string;
  text: string;
  timestamp: string;
}

// ==================== Room Types ====================

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

// ==================== WebSocket Types ====================

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

// ==================== WebSocket Payload Types ====================

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

// ==================== Environment Config ====================

export interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  NODE_ENV: string;
}

// ==================== Active User ====================

export interface ActiveUser {
  username: string;
  identifier: string;
  currentRoom: string | null;
  ws: AuthenticatedWebSocket;
}