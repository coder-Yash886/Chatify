import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import { registerWithOTP, sendLoginOTP, verifyOTP, resendOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

type AuthStep = 'input' | 'otp';
type AuthMode = 'login' | 'register';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('input');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    setError('');
    setMessage('');

    if (mode === 'register' && !username.trim()) {
      setError('Username is required');
      return;
    }

    if (!identifier.trim()) {
      setError('Email is required');
      return;
    }

    if (!identifier.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const response = await registerWithOTP({
          username: username.trim(),
          identifier: identifier.trim(),
          type: 'email',
        });

        if (response.success) {
          setMessage(response.message || 'OTP sent to your email');
          setStep('otp');
        } else {
          setError(response.error || 'Failed to send OTP');
        }
      } else {
        const response = await sendLoginOTP({
          identifier: identifier.trim(),
          type: 'email',
        });

        if (response.success) {
          setMessage(response.message || 'OTP sent to your email');
          setStep('otp');
        } else {
          setError(response.error || 'Failed to send OTP');
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
        identifier: identifier.trim(),
        otp: otpValue,
      });

      if (response.success && response.token) {
        setMessage('Login successful!');
        
        const loggedInUsername = mode === 'register' ? username : identifier.split('@')[0];
        login(loggedInUsername, identifier);
        
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
      const response = await resendOTP({
        identifier: identifier.trim(),
        type: 'email',
      });

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
    setStep('input');
    setOtp('');
    setError('');
    setMessage('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setUsername('');
    setIdentifier('');
    setOtp('');
    setStep('input');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💬 {import.meta.env.VITE_APP_NAME || 'Chattify'}
          </h1>
          <p className="text-primary-100">
            Real-time chat with OTP authentication
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="flex gap-2 mb-6">
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
          </div>

          {step === 'input' ? (
            <>
              <div className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
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
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email"
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
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Enter OTP
                  </h3>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-medium">{identifier}</span>
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

        <p className="text-center text-primary-100 text-sm mt-6">
          Check your console for OTP during development
        </p>
      </div>
    </div>
  );
};

export default Auth;