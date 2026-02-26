import React, { useState } from 'react';
import { X, Camera, User as UserIcon, Mail, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.identifier || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-400 text-sm mb-6">Your profile information</p>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 border-2 border-[#1a1a1a] rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Click the camera icon to update your photo</p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <UserIcon className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Account Information */}
          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Member Since</span>
                <span className="text-sm text-white font-medium">Jan 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Account Status</span>
                <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;