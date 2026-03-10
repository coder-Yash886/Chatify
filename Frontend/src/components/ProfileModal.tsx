import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/api';
import { useTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadProfile();
    }
  }, [isOpen, user]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProfile();
      if (response.success) {
        setUsername(response.profile.username || '');
        setBio(response.profile.bio || '');
        setStatus(response.profile.status || '');
        setProfilePicture(response.profile.profilePicture || '');
      }
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);
      setError('');
      console.log('✅ Image loaded, size:', base64String.length, 'characters');
    };
    reader.onerror = () => {
      setError('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Saving profile with picture:', profilePicture ? 'Yes' : 'No');
      
      const response = await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        status: status.trim(),
        profilePicture: profilePicture,
      });

      if (response.success) {
        setMessage('Profile updated successfully!');
        console.log('✅ Profile saved successfully');
        setTimeout(() => {
          onClose();
          window.location.reload(); // Reload to show new picture
        }, 1500);
      }
    } catch (err: any) {
      console.error('❌ Update profile error:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicture('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'} rounded-2xl w-full max-w-md border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'} rounded-lg transition cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-600">
                      <UserIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  {/* Camera Button Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer"
                  >
                    Upload Photo
                  </button>
                  {profilePicture && (
                    <button
                      onClick={handleRemovePhoto}
                      className={`px-4 py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-lg transition text-sm cursor-pointer`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0a0a0a] border-gray-800 text-white'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  value={user?.identifier || ''}
                  disabled
                  className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-gray-900 border-gray-800 text-gray-500'} border rounded-xl cursor-not-allowed`}
                />
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                  Status
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  maxLength={100}
                  className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0a0a0a] border-gray-800 text-white'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Hey there! I am using Chatty"
                />
                <p className="text-xs text-gray-500 mt-1">{status.length}/100</p>
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0a0a0a] border-gray-800 text-white'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/200</p>
              </div>

              {/* Messages */}
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
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className={`p-6 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} flex gap-3`}>
            <button
              onClick={onClose}
              className={`flex-1 py-3 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-xl font-semibold transition cursor-pointer`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
