import React, { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { searchUsers, addFriend, type UserProfile } from '../api/api';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose, onFriendAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await searchUsers(searchQuery.trim());
      setSearchResults(response.users);
      console.log('🔍 Search results:', response.users);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (email: string) => {
    setAdding(email);
    try {
      await addFriend(email);
      console.log('✅ Friend added:', email);
      setSearchQuery('');
      setSearchResults([]);
      onFriendAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add friend:', error);
      alert(error.response?.data?.error || 'Failed to add friend');
    } finally {
      setAdding(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add Friend</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) handleSearch();
                  else setSearchResults([]);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {searching ? '...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchQuery ? (
                  <>
                    <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No users found</p>
                  </>
                ) : (
                  <>
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Search for users to connect</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-3 hover:bg-[#0a0a0a] rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user.email)}
                      disabled={adding === user.email}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer disabled:opacity-50"
                    >
                      {adding === user.email ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;