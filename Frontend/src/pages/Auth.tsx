import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { register, login, verifyOTP, resendOTP } from '../api/api';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';

type AuthMode = 'login' | 'register';
type AuthStep = 'credentials' | 'otp';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  
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
      if (!username.trim() || username.length < 3) {
        setError('Name must be at least 3 characters');
        return;
      }
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (!password.trim() || password.length < 6) {
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
          navigate('/chat');
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
        navigate('/chat');
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
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setStep('credentials');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Panel - Welcome Message */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        
        <div className="relative z-10 text-center max-w-md">
          {step === 'credentials' ? (
            <>
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
                  <MessageSquare className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Welcome {mode === 'login' ? 'Back' : 'to Chatty'}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {mode === 'login' 
                  ? 'Sign in to continue your conversations and catch up with your messages.'
                  : 'Create an account to start connecting with friends and colleagues.'}
              </p>
              <div className="mt-12">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cg fill='%23333'%3E%3Crect x='50' y='50' width='80' height='60' rx='8'/%3E%3Crect x='150' y='70' width='100' height='40' rx='8'/%3E%3Crect x='270' y='50' width='80' height='60' rx='8'/%3E%3C/g%3E%3C/svg%3E" 
                  alt="Chat illustration"
                  className="w-full opacity-20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
                  <Mail className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Check Your Email
              </h1>
              <p className="text-gray-400 text-lg">
                We've sent a verification code to your email address. Please enter it below to complete your registration.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl mb-4">
              <MessageSquare className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-white">Chatty</h2>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl border border-gray-800">
            {step === 'credentials' ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {mode === 'login' 
                      ? 'Sign in to your account' 
                      : 'Get started with Chatty'}
                  </p>
                </div>

                <div className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-11 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
                      {message}
                    </div>
                  )}

                  <button
                    onClick={handleSubmitCredentials}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
                  </button>

                  <div className="text-center mt-6">
                    <button
                      onClick={switchMode}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      {mode === 'login' 
                        ? "Don't have an account? " 
                        : 'Already have an account? '}
                      <span className="text-blue-500 font-semibold">
                        {mode === 'login' ? 'Create account' : 'Sign in'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Verify Your Email
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-medium text-blue-400">{email}</span>
                  </p>
                </div>

                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                />

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                    {message}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('credentials')}
                    className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-700 transition"
                  >
                    Change Email
                  </button>
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="flex-1 bg-blue-600/20 text-blue-400 py-3 rounded-xl font-medium hover:bg-blue-600/30 transition disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;