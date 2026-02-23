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


export interface DirectMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  otherUser: string;
  lastMessage?: {
    text: string;
    timestamp: string;
  };
  unreadCount: number;
}

export const getConversations = async (): Promise<{ success: boolean; conversations: Conversation[] }> => {
  const response = await api.get('/api/dm/conversations');
  return response.data;
};

export const getDirectMessages = async (otherUserId: string): Promise<{ success: boolean; messages: DirectMessage[] }> => {
  const response = await api.get(`/api/dm/messages/${otherUserId}`);
  return response.data;
};

export const sendDirectMessage = async (to: string, text: string, type?: string): Promise<{ success: boolean; message: DirectMessage }> => {
  const response = await api.post('/api/dm/send', { to, text, type });
  return response.data;
};

export const markDMAsRead = async (otherUserId: string): Promise<void> => {
  await api.post('/api/dm/read', { otherUserId });
};


export interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  statusMessage?: string;
  createdAt: string;
  lastSeen: string;
}

export const getUserProfile = async (userId?: string): Promise<{ success: boolean; profile: UserProfile }> => {
  const url = userId ? `/api/profile/${userId}` : '/api/profile';
  const response = await api.get(url);
  return response.data;
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> => {
  const response = await api.put('/api/profile', data);
  return response.data;
};

export const updateUserStatus = async (status: string): Promise<{ success: boolean; status: string }> => {
  const response = await api.patch('/api/profile/status', { status });
  return response.data;
};

export const searchUsers = async (query: string): Promise<{ success: boolean; users: UserProfile[] }> => {
  const response = await api.get('/api/users/search', { params: { query } });
  return response.data;
};


export default api;