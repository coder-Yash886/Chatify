
// export interface User {
//   username: string;
//   identifier: string;
// }


// export interface RegisterRequest {
//   username: string;
//   identifier: string;
//   type: 'email' | 'sms';
// }

// export interface LoginRequest {
//   identifier: string;
//   type: 'email' | 'sms';
// }

// export interface VerifyOTPRequest {
//   identifier: string;
//   otp: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   message?: string;
//   error?: string;
//   token?: string;
// }


// export interface Message {
//   username: string;
//   text: string;
//   timestamp: string;
// }


// export interface Room {
//   id: string;
//   name: string;
//   userCount: number;
// }


// export type WSMessageType =
//   | 'auth'
//   | 'auth-success'
//   | 'auth-error'
//   | 'join-room'
//   | 'room-history'
//   | 'new-message'
//   | 'user-joined'
//   | 'user-left'
//   | 'typing'
//   | 'stop-typing'
//   | 'user-typing'
//   | 'user-stop-typing'
//   | 'room-users'
//   | 'error';

// export interface WSMessage {
//   type: WSMessageType;
//   payload?: any;
//   timestamp?: string;
// }

// ==================== User Types ====================

// User Types
export interface User {
  username: string;
  identifier: string;
}

// Auth Types
export interface RegisterRequest {
  username: string;
  identifier: string;
  type: 'email' | 'sms';
}

export interface LoginRequest {
  identifier: string;
  type: 'email' | 'sms';
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

// Message Types
export interface Message {
  username: string;
  text: string;
  timestamp: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  userCount: number;
}

// WebSocket Types
export type WSMessageType =
  | 'auth'
  | 'auth-success'
  | 'auth-error'
  | 'join-room'
  | 'room-history'
  | 'new-message'
  | 'user-joined'
  | 'user-left'
  | 'typing'
  | 'stop-typing'
  | 'user-typing'
  | 'user-stop-typing'
  | 'room-users'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  payload?: any;
  timestamp?: string;
}