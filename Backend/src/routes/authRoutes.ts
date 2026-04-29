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

router.post('/register', register);

router.post('/verify-otp', verifyRegistrationOTP);

router.post('/resend-otp', resendOTP);


router.post('/login', login);


router.post('/logout', logout);


router.get('/verify', authenticateToken, verify);


router.get('/users', getAllUsers);

export default router;
