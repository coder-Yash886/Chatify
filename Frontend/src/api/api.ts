import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Auth Types ====================

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

// ==================== Auth APIs ====================

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/register', data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/verify-registration', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/login', data);
  return response.data;
};

export const resendOTP = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/resend-registration-otp', { email });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/api/logout');
};

export const verifyToken = async (): Promise<{ success: boolean; username: string; identifier: string }> => {
  const response = await api.get('/api/verify');
  return response.data;
};

// ==================== Room APIs ====================

export interface Room {
  id: string;
  name: string;
  userCount: number;
}

export const getRooms = async (): Promise<{ success: boolean; rooms: Room[] }> => {
  const response = await api.get('/api/rooms');
  return response.data;
};

export const createRoom = async (
  roomId: string,
  roomName: string,
): Promise<{ success: boolean; message?: string; room?: Room; error?: string }> => {
  const response = await api.post<{ success: boolean; message?: string; room?: Room; error?: string }>('/api/rooms', {
    roomId,
    roomName,
  });
  return response.data;
};

// ==================== Friend APIs ====================

export interface Friend {
  username: string;
  identifier: string;
  isOnline: boolean;
  profilePicture?: string; // Added profile picture
  bio?: string; // Added bio
  status?: string; // Added status
  lastSeen?: string;
}

export const getFriends = async (): Promise<{ success: boolean; friends: Friend[]; onlineCount: number }> => {
  const response = await api.get('/api/friends');
  return response.data;
};

export const addFriend = async (email: string): Promise<AuthResponse> => {
  const response = await api.post('/api/friends/add', { friendEmail: email });
  return response.data;
};

// ==================== Block APIs ====================

export interface BlockedUser {
  username: string;
  email: string;
  profilePicture?: string;
}

export const getBlockedUsers = async (): Promise<{ success: boolean; blockedUsers: BlockedUser[] }> => {
  const response = await api.get('/api/blocked');
  return response.data;
};

export const unblockUser = async (email: string): Promise<{ success: boolean; message?: string }> => {
  const response = await api.post('/api/unblock', { email });
  return response.data;
};

// ==================== Notification APIs ====================

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

// ==================== Direct Message APIs ====================

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

// ==================== Profile APIs (UPDATED) ====================

export interface UserProfile {
  username: string;
  email: string;
  profilePicture?: string; // Changed from avatar to profilePicture
  bio?: string;
  status?: string; // Changed to simple string
  createdAt?: string;
}

// Get own profile
export const getProfile = async (): Promise<{ success: boolean; profile: UserProfile }> => {
  const response = await api.get('/api/profile');
  return response.data;
};

// Get another user's profile
export const getUserProfile = async (userId: string): Promise<{ success: boolean; profile: UserProfile }> => {
  const response = await api.get(`/api/profile/${userId}`);
  return response.data;
};

// Update own profile
export const updateProfile = async (data: {
  username?: string;
  bio?: string;
  status?: string;
  profilePicture?: string;
}): Promise<{ success: boolean; profile: UserProfile }> => {
  const response = await api.put('/api/profile', data);
  return response.data;
};

// Update status only
export const updateStatus = async (status: string): Promise<{ success: boolean; status: string }> => {
  const response = await api.patch('/api/profile/status', { status });
  return response.data;
};

// Search users
export const searchUsers = async (query: string): Promise<{ success: boolean; users: UserProfile[] }> => {
  const response = await api.get('/api/users/search', { params: { query } });
  return response.data;
};

export default api;