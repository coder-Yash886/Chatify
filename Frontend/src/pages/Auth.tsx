import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { register, verifyOTP, login, resendOTP } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await register({ username, email, password });
      if (response.success) {
        setShowOTP(true);
        setMessage('OTP sent to your email!');
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP({ identifier: email, otp: otpCode });
      if (response.success && response.token) {
        setUser(username, email);
        navigate('/chat');
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : 'Invalid OTP';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response.success && response.token) {
        setUser(email.split('@')[0], email);
        navigate('/chat');
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      setMessage('OTP resent successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Failed to resend OTP');
    }
  };

  // OTP Verification View
  if (showOTP) {
    return (
      <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-6 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 p-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#0f1219] border border-white/5 rounded-3xl p-10 sm:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Verify Email</h2>
              <p className="text-sm text-white/50">Enter the 6-digit code sent to</p>
              <p className="text-sm font-medium text-white/80 mt-1">{email}</p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-medium text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm text-center">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Didn't receive code? <span className="text-indigo-400 font-medium">Resend</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Login / Register View
  return (
    <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* Background Grid Pattern (subtle) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 p-6 z-20">
        <button
          onClick={() => navigate('/')}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-[#0f1219] border border-white/5 rounded-[2rem] p-10 sm:p-12 shadow-2xl">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-white/50">
              {isLogin ? 'Continue chatting without distractions' : 'Join and start messaging instantly'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Full Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Email or Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or username"
                className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center pt-2">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-indigo-500 text-white rounded-xl font-semibold text-sm hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
                </div>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>

            {isLogin && (
              <div className="text-center pt-2">
                <button type="button" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <p className="text-sm text-white/50">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setMessage('');
                  }}
                  className="text-white hover:text-indigo-400 font-medium transition-colors"
                >
                  {isLogin ? 'Create one' : 'Login'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;