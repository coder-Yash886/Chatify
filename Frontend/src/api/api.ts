import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


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

export interface Room {
  id: string;
  name: string;
  userCount: number;
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/verify-otp', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const resendOTP = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/resend-otp', { email });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
};

export const verifyToken = async (): Promise<{ success: boolean; username: string; identifier: string }> => {
  const response = await api.get('/api/auth/verify');
  return response.data;
};

export const getRooms = async (): Promise<{ success: boolean; rooms: Room[] }> => {
  const response = await api.get('/api/rooms');
  return response.data;
};

export const createRoom = async (roomId: string, roomName: string): Promise<any> => {
  const response = await api.post('/api/rooms', { roomId, roomName });
  return response.data;
};


export interface Friend {
  username: string;
  identifier: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const getFriends = async (): Promise<{ success: boolean; friends: Friend[]; onlineCount: number }> => {
  const response = await api.get('/api/friends');
  return response.data;
};

export const addFriend = async (friendEmail: string): Promise<AuthResponse> => {
  const response = await api.post('/api/friends/add', { friendEmail });
  return response.data;
};


export interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'friend_accepted' | 'room_invite';
  from: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export const getNotifications = async (): Promise<{ success: boolean; notifications: Notification[]; unreadCount: number }> => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api.post('/api/notifications/read', { notificationId });
};


export default api;