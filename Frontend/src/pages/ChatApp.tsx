import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getFriends, 
  getNotifications,
  getDirectMessages,
  sendDirectMessage,
  searchUsers,
  addFriend,
  type Friend, 
  type Notification,
  type DirectMessage,
  type UserProfile 
} from '../api/api';
import { formatDistanceToNow, format } from 'date-fns';

type Tab = 'direct' | 'group' | 'public';

const ChatApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState<Tab>('direct');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Suggestions
  const suggestions = [
    { name: 'Austin', time: '32 min/wk', avatar: '👨' },
    { name: 'Thomas', time: '22 min/wk', avatar: '👨‍💼' },
    { name: 'Chase', time: '32 min/wk', avatar: '👦' },
    { name: 'Xavier', time: '12 min/wk', avatar: '🧑' },
  ];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.identifier);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      const [friendsData, notificationsData] = await Promise.all([
        getFriends(),
        getNotifications(),
      ]);

      setFriends(friendsData.friends);
      setNotifications(notificationsData.notifications);
      setUnreadCount(notificationsData.unreadCount);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getDirectMessages(userId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      const response = await sendDirectMessage(selectedChat.identifier, messageText.trim());
      setMessages([...messages, response.message]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchUsers(searchQuery.trim());
      setSearchResults(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddFriend = async (email: string) => {
    try {
      await addFriend(email);
      loadData();
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-6">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 flex flex-col gap-4">
          <button className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Phone className="w-6 h-6" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Video className="w-6 h-6" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          
          {/* Logout on hover */}
          <button
            onClick={handleLogout}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all shadow-lg"
          >
            <LogOut className="w-4 h-4 inline mr-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Chat List Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Chats</h2>
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'direct'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'group'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Group
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Public
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">No chats yet</p>
              <button
                onClick={() => setShowSearch(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Add friends to start chatting
              </button>
            </div>
          ) : (
            friends.map((friend) => (
              <button
                key={friend.identifier}
                onClick={() => setSelectedChat(friend)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                  selectedChat?.identifier === friend.identifier ? 'bg-blue-50' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {friend.username[0].toUpperCase()}
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">{friend.username}</p>
                    <span className="text-xs text-gray-400">10:30am</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {friend.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedChat.username[0].toUpperCase()}
                  </div>
                  {selectedChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.username}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.isOnline ? 'Active now' : 'Last seen 10 min ago'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-500">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isOwn = msg.from === user?.identifier;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isOwn
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-gray-400'
                              }`}
                            >
                              {format(new Date(msg.timestamp), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="h-20 bg-white border-t border-gray-200 px-6 flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Say something..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Notifications & Suggestions */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Notifications */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Notification</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {notif.from[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notif.from}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Suggestions</h3>
            <button className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
              {suggestions.length}
            </button>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {suggestion.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                    <p className="text-xs text-gray-500">{suggestion.time}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition opacity-0 group-hover:opacity-100">
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Friend</h3>
              <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) handleSearch();
                  }}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddFriend(user.email)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;