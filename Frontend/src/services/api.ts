import axios from 'axios';
import type { RegisterRequest, LoginRequest, VerifyOTPRequest, AuthResponse, Room } from '../types/index.js';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Auth APIs ====================

export const registerWithOTP = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/register-otp', data);
  return response.data;
};

export const sendLoginOTP = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/login-otp', data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/verify-otp', data);
  return response.data;
};

export const resendOTP = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/resend-otp', data);
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

export const getRooms = async (): Promise<{ success: boolean; rooms: Room[] }> => {
  const response = await api.get('/api/rooms');
  return response.data;
};

export const createRoom = async (roomId: string, roomName: string): Promise<any> => {
  const response = await api.post('/api/rooms', { roomId, roomName });
  return response.data;
};

export default api;