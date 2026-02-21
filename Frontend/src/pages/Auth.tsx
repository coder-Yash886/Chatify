import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, RefreshCw } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import { register, login, verifyOTP, resendOTP } from '../api/api';
import { useAuth } from '../context/AuthContext';

type AuthStep = 'credentials' | 'otp';
type AuthMode = 'login' | 'register';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [mode, setMode] = useState<AuthMode>('register');
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
      // Register validation
      if (!username.trim()) {
        setError('Username is required');
        return;
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
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
        // Register - sends OTP
        const response = await register({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        });

        if (response.success) {
          setMessage(response.message || 'OTP sent to your email');
          setStep('otp');
        } else {
          setError(response.error || 'Registration failed');
        }
      } else {
        // Login - direct login
        const response = await login({
          email: email.trim(),
          password: password.trim(),
        });

        if (response.success && response.token) {
          setMessage('Login successful!');
          authLogin(email.split('@')[0], email);
          setTimeout(() => {
            navigate('/chat');
          }, 500);
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
        setMessage('Registration successful!');
        authLogin(username, email);
        setTimeout(() => {
          navigate('/chat');
        }, 500);
      } else {
        setError(response.error || 'Invalid OTP');
        setOtp('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired OTP');
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
        setMessage('OTP resent successfully');
        setOtp('');
      } else {
        setError(response.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('credentials');
    setOtp('');
    setError('');
    setMessage('');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💬 Chattify
          </h1>
          <p className="text-primary-100">
            Real-time chat with secure authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 'credentials' ? (
            <>
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => mode !== 'register' && switchMode()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    mode === 'register'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => mode !== 'login' && switchMode()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    mode === 'login'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Login
                </button>
              </div>

              {/* Credentials Form */}
              <div className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <button
                  onClick={handleSubmitCredentials}
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {mode === 'register' ? 'Send OTP' : 'Login'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Enter OTP
                  </h3>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-medium">{email}</span>
                  </p>
                </div>

                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm text-center">
                    {message}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Change Email
                  </button>
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="flex-1 bg-primary-100 text-primary-700 py-3 rounded-lg font-medium hover:bg-primary-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {mode === 'register' && (
          <p className="text-center text-primary-100 text-sm mt-6">
            Check your email inbox for OTP
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;