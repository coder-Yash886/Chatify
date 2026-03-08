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
  WifiOff
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
import EmojiPicker from "emoji-picker-react";

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

  /* ---------- EMOJI STATE ---------- */
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: any) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };
  /* --------------------------------- */

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    loadFriends();
    const interval = setInterval(loadFriends, 5000);
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

  const loadFriends = async () => {
    try {
      const response = await getFriends();
      setFriends(response.friends);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await getDirectMessages(userId);
      setMessages(response.messages);
      await markDMAsRead(userId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {

    if (!messageText.trim() || !selectedChat || sending) return;

    setSending(true);
    const text = messageText;
    setMessageText('');

    try {

      const response = await sendDMAPI(selectedChat.identifier, text);

      setMessages((prev) => [...prev, response.message]);

      if (isConnected) {
        sendDirectMessage(selectedChat.identifier, text, Date.now().toString());
      }

      scrollToBottom();

    } catch (error) {

      console.error(error);
      setMessageText(text);

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
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredFriends = onlineFilter
    ? friends.filter((f) => f.isOnline)
    : friends;

  return (

    <div className={`flex h-screen ${classes.bgPrimary}`}>

      {/* LEFT SIDEBAR */}

      <div className={`w-80 ${classes.bgPrimary} border-r ${classes.border} flex flex-col`}>

        <div className={`p-4 border-b ${classes.border}`}>

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">

              <MessageCircle className="w-6 h-6 text-blue-500"/>

              <h1 className={`text-xl font-bold ${classes.textPrimary}`}>
                Chatty
              </h1>

            </div>

            <div className="flex gap-2">

              <button onClick={()=>setShowSettings(true)}>
                <Settings/>
              </button>

              <button onClick={()=>setShowProfile(true)}>
                <User/>
              </button>

              <button onClick={handleLogout}>
                <LogOut/>
              </button>

            </div>

          </div>

          <div className="relative">

            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500"/>

            <input
              placeholder="Search..."
              className={`w-full pl-10 py-2 ${classes.input} border rounded-lg`}
            />

          </div>

        </div>

        <div className="flex-1 overflow-y-auto">

          {filteredFriends.map((friend)=>(
            
            <button
              key={friend.identifier}
              onClick={()=>setSelectedChat(friend)}
              className="w-full p-4 flex gap-3 hover:bg-gray-700"
            >

              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">

                {friend.username[0].toUpperCase()}

              </div>

              <div className="text-left">

                <p className={classes.textPrimary}>
                  {friend.username}
                </p>

                <p className="text-xs text-gray-400">
                  {friend.isOnline ? "Online":"Offline"}
                </p>

              </div>

            </button>

          ))}

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

        {selectedChat ? (

          <>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {messages.map((msg)=>{

              const isOwn = msg.from === user?.identifier;

              return(

                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end":"justify-start"}`}
                >

                  <div
                    className={`px-4 py-2 rounded-xl ${
                      isOwn ? "bg-blue-600 text-white":"bg-gray-700 text-white"
                    }`}
                  >

                    {msg.text}

                    <div className="text-xs opacity-70 mt-1">
                      {format(new Date(msg.timestamp),'HH:mm')}
                    </div>

                  </div>

                </div>

              );

            })}

            <div ref={messagesEndRef}/>

          </div>

          {/* MESSAGE INPUT */}

          <div className={`relative h-20 ${classes.bgSecondary} border-t ${classes.border} px-6 flex items-center gap-3`}>

            {showEmojiPicker && (
              <div className="absolute bottom-20 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick}/>
              </div>
            )}

            <button className="p-2">
              <Paperclip/>
            </button>

            <button
              onClick={()=>setShowEmojiPicker(!showEmojiPicker)}
              className="p-2"
            >
              <Smile/>
            </button>

            <input
              value={messageText}
              onChange={(e)=>setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg"
            />

            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-600 text-white rounded-lg"
            >
              <Send/>
            </button>

          </div>

          </>

        ):(
          <div className="flex-1 flex items-center justify-center">

            <p className={classes.textSecondary}>
              Select a chat to start messaging
            </p>

          </div>
        )}

      </div>

      <AddFriendModal
        isOpen={showAddFriend}
        onClose={()=>setShowAddFriend(false)}
        onFriendAdded={loadFriends}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={()=>setShowProfile(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={()=>setShowSettings(false)}
      />

    </div>
  );
};

export default ChatApp;