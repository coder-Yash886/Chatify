import { WebSocket } from 'ws'

export interface User{
    username:string,
    email: string,
    phone: string,
    password: string,
    isVerified: boolean,
    createdAt: Date;
}

export interface AuthPayload{
username: string,
identifier: string
}

export interface OTP{
    code: string,
    expiresAt: Date,
    attempts: number;
}
export interface OTPStore{
    [identifier: string]: OTP;
}

export interface SendOTPRequest{
    identifier: string;
    types: 'email' | 'sms';
}

export interface VerifyOTPRequest{
identifier:string,
otp: string;
}

export interface RegisterWithOTPRequest{
    username: string,
    identifier: string;
    type: 'email' | 'sms'
}

export interface OTPResponse{
    success: boolean,
    message?: string,
    error?: string,
    token?: string;
    
}

export interface Message{
    username: string
    text: string
    timestamp: string
}

export interface Room{
    name: string
    user: Set<string>
    message: Message[];
}

export interface RoomInfo{
    id: string
    name: string
    userCount: number
}

export interface AuthenticatedWebSocket extends WebSocket{
    username: string
    identifier: string
    currentRoom: string | null
    isAlive: boolean
}

export type WebSocketMessageType = 'auth' | 'auth-success' | 'auth-error' | 'join-room' | 'leave-room' | 'room-joined' | 'room-history' | 'send-message' | 'new-message' | 'user-joined' | 'user-left' | 'typing' | 'stop-typing' | 'user-typing' | 'user-stop-typing' | 'room-users' | 'error';

export interface WebSocketMessage{
    type: WebSocketMessageType;
    payload: any;
    timestamp?: string
}

export interface JoinRoomPayload{
    roomId: string
}

export interface SendMessagePayload{
    text: string
}

export interface UserJoinPayload{
    username:string
    userCount: number
}

export interface UserLeftPayload{
    username: string
    userCount: number
}

export interface EnvConfig{
    PORT: number
    JWT_SECRET:string
    NODE_ENV: string
}

export interface ActiveUser{
    username: string
    identifier: string
    currentRoom: string | null
    ws: AuthenticatedWebSocket
}