import React, { useState } from 'react';
import { Search, UserPlus, X, Check } from 'lucide-react';
import { searchUsers, addFriend, type UserProfile } from '../api/api';

interface UserSearchProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingUser, setAddingUser] = useState<string | null>(null);
  const [addedUsers, setAddedUsers] = useState<string[]>([]);

  // 🔎 SEARCH USERS
  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await searchUsers(query.trim());
      setResults(response.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  // ➕ ADD FRIEND + OPEN CHAT
  const handleAddFriend = async (email: string) => {
    try {
      setAddingUser(email);

      await addFriend(email);

      // mark as added
      setAddedUsers((prev) => [...prev, email]);

      // 🔥 open DM chat immediately
      onSelectUser(email);

      // 🔥 close modal
      onClose();
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setAddingUser(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">

        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Search Users</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={searching || !query.trim()}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg disabled:opacity-50"
            >
              {searching ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="max-h-96 overflow-y-auto p-4">
          {results.length === 0 ? (
            <p className="text-center text-gray-400 py-6">
              {query ? 'No users found' : 'Search for users to connect'}
            </p>
          ) : (
            <div className="space-y-3">
              {results.map((user) => {
                const isAdded = addedUsers.includes(user.email);
                const isAdding = addingUser === user.email;

                return (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    {/* USER INFO */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* ADD BUTTON */}
                    {isAdded ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Added
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(user.email)}
                        disabled={isAdding}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg disabled:opacity-50"
                      >
                        {isAdding ? (
                          '...'
                        ) : (
                          <UserPlus className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserSearch;