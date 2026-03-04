
// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Send, LogOut, Users, LayoutDashboard, MessageSquare } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useWebSocket } from '../context/WebSocketContext';
// import ChatMessage from '../components/ChatMessage';
// import RoomList from '../components/RoomList';
// import TypingIndicator from '../components/TypingIndicator';
// import Dashboard from '../components/Dashboard';

// type ActiveTab = 'dashboard' | 'chat';

// const Chat: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const {
//     currentRoom,
//     messages,
//     typingUsers,
//     roomUsers,
//     sendMessage,
//     sendTyping,
//     sendStopTyping,
//     isConnected,
//   } = useWebSocket();

//   const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
//   const [messageText, setMessageText] = useState('');
//   const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !currentRoom) return;

//     sendMessage(messageText.trim());
//     setMessageText('');
//     sendStopTyping();
//   };

//   const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessageText(e.target.value);

//     if (e.target.value.trim()) {
//       sendTyping();

//       if (typingTimeout) {
//         clearTimeout(typingTimeout);
//       }

//       const timeout = window.setTimeout(() => {
//         sendStopTyping();
//       }, 2000);

//       setTypingTimeout(timeout);
//     } else {
//       sendStopTyping();
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
//           <div className="flex items-center justify-between mb-3">
//             <h2 className="text-xl font-bold text-white">
//               💬 Chattify
//             </h2>
//             <button
//               onClick={handleLogout}
//               className="p-2 hover:bg-white/20 rounded-lg transition"
//               title="Logout"
//             >
//               <LogOut className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           <div className="flex items-center gap-2 text-primary-100 text-sm">
//             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
//             <span>{user?.username}</span>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex gap-2">
//             <button
//               onClick={() => setActiveTab('dashboard')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition ${
//                 activeTab === 'dashboard'
//                   ? 'bg-primary-500 text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               Dashboard
//             </button>
//             <button
//               onClick={() => setActiveTab('chat')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition ${
//                 activeTab === 'chat'
//                   ? 'bg-primary-500 text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               <MessageSquare className="w-4 h-4" />
//               Rooms
//             </button>
//           </div>
//         </div>

//         {/* Rooms (only show when chat tab active) */}
//         {activeTab === 'chat' && (
//           <div className="flex-1 overflow-y-auto p-4">
//             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
//               Rooms
//             </h3>
//             <RoomList />
//           </div>
//         )}
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {activeTab === 'dashboard' ? (
//           <div className="flex-1 overflow-y-auto p-6">
//             <Dashboard />
//           </div>
//         ) : currentRoom ? (
//           <>
//             {/* Chat Header */}
//             <div className="bg-white border-b border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     # {currentRoom}
//                   </h2>
//                   <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                     <Users className="w-4 h-4" />
//                     <span>{roomUsers.length} members online</span>
//                   </div>
//                 </div>
//                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
//                   isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                 }`}>
//                   <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                   {isConnected ? 'Connected' : 'Disconnected'}
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
//               {messages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center text-gray-400">
//                     <p className="text-lg font-medium">No messages yet</p>
//                     <p className="text-sm">Be the first to say something!</p>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   {messages.map((msg, index) => (
//                     <ChatMessage key={index} message={msg} />
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </>
//               )}
//             </div>

//             {/* Typing Indicator */}
//             <TypingIndicator typingUsers={typingUsers} />

//             {/* Message Input */}
//             <div className="bg-white border-t border-gray-200 p-4">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={messageText}
//                   onChange={handleTyping}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type a message..."
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!messageText.trim()}
//                   className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   <Send className="w-5 h-5" />
//                   Send
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center text-gray-400">
//               <p className="text-lg font-medium">Select a room to start chatting</p>
//               <p className="text-sm">Choose from the Rooms tab</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Settings,
  User,
  LogOut,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Users,
  Plus,
  MessageCircle,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getFriends, 
  getDirectMessages,
  sendDirectMessage,
  type Friend, 
  type DirectMessage
} from '../api/api';
import { format, formatDistanceToNow } from 'date-fns';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import AddFriendModal from '../components/AddFriendModal';

const ChatApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onlineFilter, setOnlineFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadFriends();
    const interval = setInterval(loadFriends, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.identifier);
      const interval = setInterval(() => loadMessages(selectedChat.identifier), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadFriends = async () => {
    try {
      const response = await getFriends();
      setFriends(response.friends);
      console.log('👥 Loaded friends:', response.friends);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await getDirectMessages(userId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || sending) return;

    setSending(true);
    const tempText = messageText.trim();
    setMessageText('');

    try {
      const response = await sendDirectMessage(selectedChat.identifier, tempText);
      setMessages([...messages, response.message]);
      console.log('✅ Message sent:', response.message);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(tempText);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredFriends = onlineFilter 
    ? friends.filter(f => f.isOnline) 
    : friends;

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Chatty</h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contacts Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Contacts</h2>
              <span className="text-xs text-gray-500">({filteredFriends.length})</span>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition cursor-pointer"
              title="Add Friend"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setOnlineFilter(!onlineFilter)}
            className={`text-xs px-3 py-1.5 rounded-lg transition cursor-pointer ${
              onlineFilter
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Show online only ({friends.filter(f => f.isOnline).length})
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Users className="w-16 h-16 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium mb-2">
                {onlineFilter ? 'No friends online' : 'No contacts yet'}
              </p>
              <button
                onClick={() => {
                  setShowAddFriend(true);
                  setOnlineFilter(false);
                }}
                className="text-sm text-blue-500 hover:text-blue-400 cursor-pointer"
              >
                Add friends to start chatting
              </button>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <button
                key={friend.identifier}
                onClick={() => setSelectedChat(friend)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-900 transition border-b border-gray-800/50 cursor-pointer ${
                  selectedChat?.identifier === friend.identifier ? 'bg-gray-900' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {friend.username[0].toUpperCase()}
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-white truncate">{friend.username}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {friend.isOnline ? (
                      <span className="text-green-500">● Online</span>
                    ) : (
                      'Offline'
                    )}
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
            <div className="h-16 bg-[#1a1a1a] border-b border-gray-800 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.username[0].toUpperCase()}
                  </div>
                  {selectedChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedChat.username}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isOnline ? (
                      <span className="text-green-500">● Online</span>
                    ) : (
                      `Last seen ${formatDistanceToNow(new Date(), { addSuffix: true })}`
                    )}
                  </p>
                </div>
              </div>

              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-600">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isOwn = msg.from === user?.identifier;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {isOwn ? user?.username?.[0]?.toUpperCase() : selectedChat.username[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                isOwn
                                  ? 'bg-blue-600 text-white rounded-br-sm'
                                  : 'bg-[#1a1a1a] text-white rounded-bl-sm border border-gray-800'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <p className="text-xs text-gray-500">
                                {format(new Date(msg.timestamp), 'HH:mm')}
                              </p>
                              {isOwn && (
                                msg.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-500" />
                                )
                              )}
                            </div>
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
            <div className="h-20 bg-[#1a1a1a] border-t border-gray-800 px-6 flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 px-4 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sending}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
              <MessageCircle className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the contacts list
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFriendModal 
        isOpen={showAddFriend} 
        onClose={() => setShowAddFriend(false)}
        onFriendAdded={loadFriends}
      />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatApp;