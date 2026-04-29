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
  CheckCheck,
  RefreshCw,
  Wifi,
  WifiOff,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { 
  getFriends, 
  getDirectMessages,
  sendDirectMessage as sendDMAPI,
  markDMAsRead,
  type Friend, 
  type DirectMessage
} from '../api/api';
import { format } from 'date-fns';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import AddFriendModal from '../components/AddFriendModal';
import EmojiPicker from '../components/EmojiPicker';

type IncomingDM = {
  from: string;
  fromUsername?: string;
  to: string;
  text: string;
  messageId?: string;
  timestamp: string;
};

type StatusChange = { userId: string; isOnline: boolean };

const ChatApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const classes = useThemeClasses();
  const { isConnected, sendDirectMessage, onNewDirectMessage, onStatusChange, reconnect } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onlineFilter, setOnlineFilter] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    notificationSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRA0PVanl8LJiHAU7k9n0yXgsBS17yPLaizsIGGS56+mgTQwNUKXi8bllHAU5j9f0zHgrBS16xu/ejz0KEFF+n+Dxu2oeAt/9');
  }, []);

  useEffect(() => {
    loadFriends();
    const interval = setInterval(loadFriends, 5000);
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
    const handleNewMessage = (data: unknown) => {
      const dm = data as IncomingDM;
      console.log('📩 Received new DM:', data);
      if (!selectedChat || dm.from !== selectedChat.identifier) {
        notificationSound.current?.play().catch(err => console.log('Sound error:', err));
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`💬 ${dm.fromUsername || dm.from}`, {
            body: dm.text,
            icon: '/favicon.ico',
          });
        }
      }
      if (selectedChat && dm.from === selectedChat.identifier) {
        setMessages(prev => [...prev, {
          id: dm.messageId || Date.now().toString(),
          from: dm.from,
          to: dm.to,
          text: dm.text,
          timestamp: dm.timestamp,
          isRead: false,
          type: 'text',
        }]);
        scrollToBottom();
        markDMAsRead(dm.from).catch(err => console.error('Failed to mark as read:', err));
      }
      loadFriends();
    };
    onNewDirectMessage(handleNewMessage);
  }, [selectedChat]);

  useEffect(() => {
    const handleStatusChange = (data: unknown) => {
      const status = data as StatusChange;
      console.log(`👥 Status update: ${status.userId} is ${status.isOnline ? 'online' : 'offline'}`);
      setFriends(prev => prev.map(f => 
        f.identifier === status.userId 
          ? { ...f, isOnline: status.isOnline }
          : f
      ));
    };
    onStatusChange(handleStatusChange);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadFriends = async () => {
    try {
      const response = await getFriends();
      setFriends(response.friends);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await getDirectMessages(userId);
      setMessages(response.messages);
      try {
        await markDMAsRead(userId);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || sending) return;

    setSending(true);
    const tempText = messageText.trim();
    const messageId = Date.now().toString();
    setMessageText('');
    setShowEmojiPicker(false);

    try {
      const response = await sendDMAPI(selectedChat.identifier, tempText);
      setMessages(prev => [...prev, response.message]);
      if (isConnected) {
        sendDirectMessage(selectedChat.identifier, tempText, messageId);
        console.log('📤 Sent via WebSocket');
      } else {
        console.warn('⚠️ WebSocket not connected');
      }
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(tempText);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
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
    <div className={`flex h-[100dvh] w-full ${classes.bgPrimary} overflow-hidden relative`}>
      {/* Left Sidebar */}
      <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex flex-col ${classes.bgPrimary} border-r ${classes.border} transition-transform duration-300 ${
        selectedChat ? '-translate-x-full absolute inset-y-0 left-0 md:relative md:translate-x-0' : 'translate-x-0 absolute inset-y-0 left-0 md:relative'
      } z-10 md:z-0`}>
        {/* Header */}
        <div className={`p-4 border-b ${classes.border}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${classes.textPrimary}`}>Chatty</h1>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ml-1 ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!isConnected && (
                <button
                  onClick={reconnect}
                  className={`p-2 ${classes.textSecondary} ${classes.hoverText} ${classes.hoverBg} rounded-lg transition cursor-pointer`}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 ${classes.textSecondary} ${classes.hoverText} ${classes.hoverBg} rounded-lg transition cursor-pointer`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className={`p-2 ${classes.textSecondary} ${classes.hoverText} ${classes.hoverBg} rounded-lg transition cursor-pointer`}
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
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
              className={`w-full pl-10 pr-4 py-2.5 ${classes.input} border rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
          </div>
        </div>

        {/* Contacts Header */}
        <div className={`p-4 border-b ${classes.border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <h2 className={`text-sm font-semibold ${classes.textPrimary}`}>Contacts</h2>
              <span className="text-xs text-gray-500 font-medium">({filteredFriends.length})</span>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setOnlineFilter(!onlineFilter)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition cursor-pointer w-full sm:w-auto text-left sm:text-center ${
              onlineFilter
                ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                : `${classes.bgTertiary} ${classes.textSecondary} ${classes.hoverBg} border border-transparent`
            }`}
          >
            Show online only ({friends.filter(f => f.isOnline).length})
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-70">
              <Users className="w-16 h-16 text-gray-500 mb-3" />
              <p className={`${classes.textSecondary} font-medium mb-2`}>
                {onlineFilter ? 'No friends online' : 'No contacts yet'}
              </p>
              <button
                onClick={() => {
                  setShowAddFriend(true);
                  setOnlineFilter(false);
                }}
                className="text-sm text-blue-500 hover:text-blue-400 font-medium cursor-pointer"
              >
                Add friends to start chatting
              </button>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <button
                key={friend.identifier}
                onClick={() => setSelectedChat(friend)}
                className={`w-full p-4 flex items-center gap-3 ${classes.hoverBgLight} transition border-b ${classes.borderLight} cursor-pointer group ${
                  selectedChat?.identifier === friend.identifier ? classes.activeBg : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm group-hover:shadow-md transition-shadow">
                    {friend.username[0].toUpperCase()}
                  </div>
                  {friend.isOnline && (
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 ${classes.bgPrimary} rounded-full`}></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`font-semibold ${classes.textPrimary} truncate text-sm sm:text-base`}>{friend.username}</p>
                    {/* Add unread badge or time here if API supports it */}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 truncate flex items-center gap-1.5">
                    {friend.isOnline ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        <span className="text-green-500 font-medium">Online</span>
                      </>
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
      <div className={`flex-1 flex flex-col min-w-0 bg-[#f0f2f5] dark:bg-[#0b141a] transition-transform duration-300 ${
        selectedChat ? 'translate-x-0 absolute inset-y-0 right-0 left-0 md:relative' : 'translate-x-full absolute inset-y-0 right-0 left-0 md:relative md:translate-x-0'
      } z-20 md:z-0`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className={`h-[68px] flex-shrink-0 ${classes.bgSecondary} border-b ${classes.border} px-2 sm:px-6 flex items-center justify-between shadow-sm z-10`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className={`md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition cursor-pointer`}
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                    {selectedChat.username[0].toUpperCase()}
                  </div>
                  {selectedChat.isOnline && (
                    <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 ${classes.bgSecondary} rounded-full`}></div>
                  )}
                </div>
                <div className="ml-1 sm:ml-2">
                  <h3 className={`font-semibold ${classes.textPrimary} text-base sm:text-lg leading-tight`}>{selectedChat.username}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {selectedChat.isOnline ? (
                      <span className="text-green-500 font-medium">online</span>
                    ) : (
                      'offline'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => loadMessages(selectedChat.identifier)}
                  className={`p-2 ${classes.textSecondary} ${classes.hoverText} ${classes.hoverBg} rounded-full transition cursor-pointer`}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className={`p-2 ${classes.textSecondary} ${classes.hoverText} ${classes.hoverBg} rounded-full transition cursor-pointer`}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-cover bg-center`}
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                backgroundColor: classes.bgPrimary.includes('white') ? '#efeae2' : '#0b141a',
                backgroundBlendMode: 'overlay',
              }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className={`text-center bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-sm border ${classes.borderLight}`}>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className={`${classes.textPrimary} font-medium mb-1`}>No messages here yet...</p>
                    <p className="text-sm text-gray-500">Send a message to start chatting!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isOwn = msg.from === user?.identifier;
                    const showDate = index === 0 || new Date(msg.timestamp).getDate() !== new Date(messages[index - 1].timestamp).getDate();
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4 sm:my-6">
                            <span className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                              {format(new Date(msg.timestamp), 'MMMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                        >
                          <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]`}>
                            <div
                              className={`px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-[18px] relative shadow-sm ${
                                isOwn
                                  ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-br-sm'
                                  : 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-800'
                              }`}
                            >
                              <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words inline-block">
                                {msg.text}
                                {/* Invisible spacer to prevent time overlap */}
                                <span className="inline-block w-12 h-4"></span>
                              </p>
                              
                              <div className={`absolute bottom-1 right-2 flex items-center gap-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                                <p className="text-[10px] sm:text-xs">
                                  {format(new Date(msg.timestamp), 'HH:mm')}
                                </p>
                                {isOwn && (
                                  msg.isRead ? (
                                    <CheckCheck className="w-[14px] h-[14px] text-blue-200" />
                                  ) : (
                                    <Check className="w-[14px] h-[14px] opacity-70" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className={`p-2 sm:p-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-end gap-2 sm:gap-3 z-10`}>
              <button className={`p-2 sm:p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition cursor-pointer flex-shrink-0 mb-1`}>
                <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-2xl sm:rounded-3xl flex items-end relative shadow-sm border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-colors">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition cursor-pointer flex-shrink-0 ${
                    showEmojiPicker ? 'text-blue-500' : ''
                  }`}
                >
                  <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-14 left-0">
                    <EmojiPicker
                      onEmojiClick={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                      position="top"
                    />
                  </div>
                )}
                
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Message"
                  disabled={sending}
                  rows={1}
                  className={`flex-1 max-h-[120px] py-3 pr-4 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none text-sm sm:text-[15px] custom-scrollbar disabled:opacity-50 min-h-[44px] sm:min-h-[48px]`}
                />
              </div>
              
              {messageText.trim() ? (
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="p-3 sm:p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-md flex-shrink-0 mb-1 sm:mb-0.5"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
              ) : (
                <button className="p-3 sm:p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-md flex-shrink-0 mb-1 sm:mb-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24"><path d="M11.999 14.942c2.005 0 3.534-1.53 3.534-3.534V4.35c0-2.005-1.529-3.534-3.534-3.534-2.006 0-3.534 1.529-3.534 3.534v7.058c0 2.004 1.528 3.534 3.534 3.534z" /><path d="M17.634 11.408c0-3.111-2.522-5.632-5.635-5.632-3.112 0-5.634 2.521-5.634 5.632H4.61c0 3.738 2.793 6.848 6.39 7.336v3.42h2.001v-3.42c3.596-.488 6.388-3.598 6.388-7.336h-1.755z" /></svg>
                  </div>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className={`hidden md:flex flex-1 items-center justify-center ${classes.bgPrimary} border-l ${classes.borderLight}`}>
            <div className="text-center bg-gray-50/50 dark:bg-[#202c33]/50 p-8 rounded-3xl backdrop-blur-md border border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MessageCircle className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className={`text-xl font-bold ${classes.textPrimary} mb-2`}>
                Chattify for Web
              </h3>
              <p className={`${classes.textSecondary} text-sm max-w-[280px] mx-auto`}>
                Select a chat from the contacts list to start messaging or search for friends.
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