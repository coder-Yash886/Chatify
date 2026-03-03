import express from 'express';
import {
  register,
  verifyRegistrationOTP,
  login,
  resendOTP,
  logout,
  verify,
  getAllUsers
} from '../controllers/authController';

import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 🔹 Register (Send OTP)
router.post('/register', register);

// 🔹 Verify OTP & Complete Registration
router.post('/verify-otp', verifyRegistrationOTP);

// 🔹 Resend OTP
router.post('/resend-otp', resendOTP);

// 🔹 Login
router.post('/login', login);

// 🔹 Logout
router.post('/logout', logout);

// 🔹 Verify JWT (Protected Route)
router.get('/verify', authenticateToken, verify);

// 🔹 Get All Users (Optional - Protect if needed)
router.get('/users', getAllUsers);

export default router;