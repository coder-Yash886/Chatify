import dotenv from 'dotenv';
import { EnvConfig } from '../types';

dotenv.config(); 

export const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_this',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const otpConfig = {
  EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
  LENGTH: parseInt(process.env.OTP_LENGTH || '6', 10),
};

export const emailConfig = {
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USER: process.env.EMAIL_USER || '',
  PASSWORD: process.env.EMAIL_PASS || '', 
};


if (!process.env.JWT_SECRET && config.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production environment');
}

console.log('🔍 Email Config Debug:', {
  USER: emailConfig.USER,
  PASSWORD_EXISTS: !!emailConfig.PASSWORD,
  PASSWORD_LENGTH: emailConfig.PASSWORD.length,
});

export default config;