import React, { useState, useEffect } from 'react';
import { X, ShieldOff, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getBlockedUsers, unblockUser } from '../api/api';

interface BlockedUser {
  username: string;
  email: string;
  profilePicture?: string;
}

interface BlockedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadBlockedUsers();
    }
  }, [isOpen]);

  const loadBlockedUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getBlockedUsers();
      if (response.success) {
        setBlockedUsers(response.blockedUsers);
      }
    } catch (err: unknown) {
      console.error('Failed to load blocked users:', err);
      setError('Failed to load blocked users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userEmail: string) => {
    try {
      await unblockUser(userEmail);
      setBlockedUsers(blockedUsers.filter(u => u.email !== userEmail));
    } catch (err: unknown) {
      console.error('Failed to unblock user:', err);
      setError('Failed to unblock user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'} rounded-2xl w-full max-w-md border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-2xl`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
          <div className="flex items-center gap-2">
            <ShieldOff className="w-5 h-5 text-red-500" />
            <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Blocked Users
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'} rounded-lg transition cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : blockedUsers.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className={`w-16 h-16 mx-auto mb-3 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`} />
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                No blocked users
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.email}
                  className={`flex items-center justify-between p-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/50'} rounded-xl`}
                >
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {user.username}
                      </p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(user.email)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      theme === 'light'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    }`}
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedUsersModal;