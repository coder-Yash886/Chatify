import {Request, Response} from 'express';
import jwt from 'jsonwebtoken'

import {
  User,
  SendOTPRequest,
  VerifyOTPRequest,
  OTPResponse,
  RegisterWithOTPRequest,
} from '../types';

import {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail,
  sendOTPSMS,
} from '../utils/otpService';
import config from '../utils/config';
import { AuthRequest } from '../middleware/auth';

export const users = new Map<string, User>();

export const registerWithOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, identifier, type }: RegisterWithOTPRequest = req.body;

    if (!username || !identifier || !type) {
      res.status(400).json({
        success: false,
        error: 'Username, identifier (email/phone), and type are required',
      } as OTPResponse);
      return;
    }
    if (username.length < 3) {
      res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters',
      } as OTPResponse);
      return;
    }

    if (type === 'email' && !identifier.includes('@')) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      } as OTPResponse);
      return;
    }

    if (type === 'sms' && !identifier.startsWith('+')) {
      res.status(400).json({
        success: false,
        error: 'Phone number must start with country code (e.g., +91)',
      } as OTPResponse);
      return;
    }

    if (users.has(identifier)) {
      res.status(400).json({
        success: false,
        error: 'User already exists. Please login.',
      } as OTPResponse);
      return;
    }


    const otp = generateOTP();
    storeOTP(identifier, otp);

    let sent = false;
    if (type === 'email') {
      sent = await sendOTPEmail(identifier, otp);
    } else if (type === 'sms') {
      sent = await sendOTPSMS(identifier, otp);
    }

    if (!sent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send OTP. Please check your configuration.',
      } as OTPResponse);
      return;
    }

    users.set(identifier, {
      username,
      email: type === 'email' ? identifier : undefined,
      phone: type === 'sms' ? identifier : undefined,
      isVerified: false,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: `OTP sent to ${identifier}. Please verify to complete registration.`,
    } as OTPResponse);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    } as OTPResponse);
  }
};

export const sendLoginOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier, type }: SendOTPRequest = req.body;

    if (!identifier || !type) {
      res.status(400).json({
        success: false,
        error: 'Identifier (email/phone) and type are required',
      } as OTPResponse);
      return;
    }

    const user = users.get(identifier);
    if (!user) {
      res.status(400).json({
        success: false,
        error: 'User not found. Please register first.',
      } as OTPResponse);
      return;
    }

    const otp = generateOTP();
    storeOTP(identifier, otp);

    let sent = false;
    if (type === 'email') {
      sent = await sendOTPEmail(identifier, otp);
    } else if (type === 'sms') {
      sent = await sendOTPSMS(identifier, otp);
    }

    if (!sent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send OTP. Please try again.',
      } as OTPResponse);
      return;
    }

    res.json({
      success: true,
      message: `OTP sent to ${identifier}`,
    } as OTPResponse);
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    } as OTPResponse);
  }
};
export const verifyOTPAndLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier, otp }: VerifyOTPRequest = req.body;

    if (!identifier || !otp) {
      res.status(400).json({
        success: false,
        error: 'Identifier and OTP are required',
      } as OTPResponse);
      return;
    }

    const isValid = verifyOTP(identifier, otp);

    if (!isValid) {
      res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP',
      } as OTPResponse);
      return;
    }

    const user = users.get(identifier);
    if (!user) {
      res.status(400).json({
        success: false,
        error: 'User not found',
      } as OTPResponse);
      return;
    }

    user.isVerified = true;
    users.set(identifier, user);

    const token = jwt.sign(
      { username: user.username, identifier },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
    } as OTPResponse);
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    } as OTPResponse);
  }
};

export const resendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier, type }: SendOTPRequest = req.body;

    if (!identifier || !type) {
      res.status(400).json({
        success: false,
        error: 'Identifier and type are required',
      } as OTPResponse);
      return;
    }

    const otp = generateOTP();
    storeOTP(identifier, otp);

    let sent = false;
    if (type === 'email') {
      sent = await sendOTPEmail(identifier, otp);
    } else if (type === 'sms') {
      sent = await sendOTPSMS(identifier, otp);
    }

    if (!sent) {
      res.status(500).json({
        success: false,
        error: 'Failed to resend OTP',
      } as OTPResponse);
      return;
    }

    res.json({
      success: true,
      message: 'OTP resent successfully',
    } as OTPResponse);
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    } as OTPResponse);
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};


export const verify = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    res.json({
      success: true,
      username: req.user.username,
      identifier: req.user.identifier,
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated',
    });
  }
};
export const getAllUsers = (req: Request, res: Response): void => {
  const userList = Array.from(users.entries()).map(([identifier, user]) => ({
    identifier,
    username: user.username,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  }));

  res.json({
    success: true,
    count: userList.length,
    users: userList,
  });
};





