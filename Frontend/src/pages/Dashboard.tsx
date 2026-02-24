import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MessageCircle } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import { register, login, verifyOTP, resendOTP } from '../api/api';
import { useAuth } from '../context/AuthContext';

type AuthStep = 'credentials' | 'otp';
type AuthMode = 'login' | 'register';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('credentials');
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitCredentials = async () => {
    setError('');
    setMessage('');

    if (mode === 'register') {
      if (!username.trim()) {
        setError('Full name is required');
        return;
      }
      if (username.length < 3) {
        setError('Name must be at least 3 characters');
        return;
      }
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const response = await register({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        });

        if (response.success) {
          setMessage('Verification code sent to your email');
          setStep('otp');
        } else {
          setError(response.error || 'Registration failed');
        }
      } else {
        const response = await login({
          email: email.trim(),
          password: password.trim(),
        });

        if (response.success && response.token) {
          authLogin(email.split('@')[0], email);
          navigate('/dashboard');
        } else {
          setError(response.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await verifyOTP({
        identifier: email.trim(),
        otp: otpValue,
      });

      if (response.success && response.token) {
        authLogin(username, email);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Invalid verification code');
        setOtp('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired code');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await resendOTP(email.trim());
      if (response.success) {
        setMessage('New code sent successfully');
        setOtp('');
      } else {
        setError(response.error || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setUsername('');
    setEmail('');
    setPassword('');
    setOtp('');
    setStep('credentials');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-6xl flex items-center justify-between gap-12 relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col items-center text-white">
          <div className="relative mb-8">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <MessageCircle className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Chattify
          </h1>
          <p className="text-xl text-purple-200 text-center max-w-md">
            Connect instantly with friends and colleagues. Real-time messaging, secure, and fast.
          </p>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 max-w-md">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
            {step === 'credentials' ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-400">
                    {mode === 'login' 
                      ? 'Enter your credentials to continue' 
                      : 'Get started with Chattify today'}
                  </p>
                </div>

                <div className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm">
                      {message}
                    </div>
                  )}

                  <button
                    onClick={handleSubmitCredentials}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={switchMode}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
                    >
                      {mode === 'login' 
                        ? "Don't have an account? Sign up" 
                        : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Verify Your Email
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We sent a 6-digit code to
                    <br />
                    <span className="font-medium text-purple-400">{email}</span>
                  </p>
                </div>

                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                />

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                    {message}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('credentials')}
                    className="flex-1 bg-white/5 text-gray-300 py-3 rounded-xl font-medium hover:bg-white/10 transition border border-white/10"
                  >
                    Change Email
                  </button>
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="flex-1 bg-purple-500/20 text-purple-400 py-3 rounded-xl font-medium hover:bg-purple-500/30 transition border border-purple-500/30 disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile branding */}
          <div className="lg:hidden text-center mt-6 text-purple-200">
            <p className="text-sm">© 2025 Chattify. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;