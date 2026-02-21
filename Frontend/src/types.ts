export interface User {
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
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

export interface RoomInfo {
  id: string;
  name: string;
  userCount: number;
}

export interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export interface WebSocketMessage<T = any> {
  type: string;
  payload?: T;
  timestamp?: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface SendMessagePayload {
  text: string;
}