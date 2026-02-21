import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterRequest, LoginRequest, VerifyOTPRequest, AuthResponse } from '../types';
import { generateOTP, storeOTP, verifyOTP, sendOTPEmail } from '../utils/otpService';
import config from '../utils/config';
import { AuthRequest } from '../middleware/auth';

export const users = new Map<string, User>();
const pendingRegistrations = new Map<string, RegisterRequest & { hashedPassword: string }>();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, error: 'All fields are required' } as AuthResponse);
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ success: false, error: 'Username must be at least 3 characters' } as AuthResponse);
      return;
    }

    if (!email.includes('@')) {
      res.status(400).json({ success: false, error: 'Invalid email format' } as AuthResponse);
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters' } as AuthResponse);
      return;
    }

    if (users.has(email)) {
      res.status(400).json({ success: false, error: 'User already exists' } as AuthResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    pendingRegistrations.set(email, { username, email, password, hashedPassword });

    const otp = generateOTP();
    storeOTP(email, otp);

    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      res.status(500).json({ success: false, error: 'Failed to send OTP email' } as AuthResponse);
      return;
    }

    res.json({ success: true, message: `OTP sent to ${email}` } as AuthResponse);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Server error' } as AuthResponse);
  }
};

export const verifyRegistrationOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp }: VerifyOTPRequest = req.body;

    if (!identifier || !otp) {
      res.status(400).json({ success: false, error: 'Email and OTP required' } as AuthResponse);
      return;
    }

    const isValid = verifyOTP(identifier, otp);
    if (!isValid) {
      res.status(400).json({ success: false, error: 'Invalid or expired OTP' } as AuthResponse);
      return;
    }

    const pending = pendingRegistrations.get(identifier);
    if (!pending) {
      res.status(400).json({ success: false, error: 'Registration expired' } as AuthResponse);
      return;
    }

    users.set(identifier, {
      username: pending.username,
      email: identifier,
      password: pending.hashedPassword,
      isVerified: true,
      createdAt: new Date(),
    });

    pendingRegistrations.delete(identifier);

    const token = jwt.sign({ username: pending.username, identifier }, config.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, message: 'Registration successful', token } as AuthResponse);
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, error: 'Server error' } as AuthResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password required' } as AuthResponse);
      return;
    }

    const user = users.get(email);
    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid email or password' } as AuthResponse);
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ success: false, error: 'Invalid email or password' } as AuthResponse);
      return;
    }

    const token = jwt.sign({ username: user.username, identifier: email }, config.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, message: 'Login successful', token } as AuthResponse);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' } as AuthResponse);
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email required' } as AuthResponse);
      return;
    }

    const pending = pendingRegistrations.get(email);
    if (!pending) {
      res.status(400).json({ success: false, error: 'No pending registration' } as AuthResponse);
      return;
    }

    const otp = generateOTP();
    storeOTP(email, otp);

    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      res.status(500).json({ success: false, error: 'Failed to resend OTP' } as AuthResponse);
      return;
    }

    res.json({ success: true, message: 'OTP resent' } as AuthResponse);
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, error: 'Server error' } as AuthResponse);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};

export const verify = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    res.json({ success: true, username: req.user.username, identifier: req.user.identifier });
  } else {
    res.status(401).json({ success: false, error: 'Not authenticated' });
  }
};

export const getAllUsers = (_req: Request, res: Response): void => {
  const userList = Array.from(users.entries()).map(([email, user]) => ({
    email,
    username: user.username,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  }));
  res.json({ success: true, count: userList.length, users: userList });
};