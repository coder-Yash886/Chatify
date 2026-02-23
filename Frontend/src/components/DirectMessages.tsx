import React, { useEffect, useState } from 'react';
import { MessageCircle, User } from 'lucide-react';
import { getConversations, type Conversation } from '../api/api';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessagesProps {
  onSelectConversation: (userId: string) => void;
  selectedUserId?: string;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({ onSelectConversation, selectedUserId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      const response = await getConversations();
      setConversations(response.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start chatting with your friends!</p>
        </div>
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.otherUser)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              selectedUserId === conv.otherUser
                ? 'bg-primary-100 border border-primary-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {conv.otherUser[0].toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-800 truncate">{conv.otherUser}</p>
                {conv.lastMessage && (
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage.text}</p>
              )}
            </div>
            {conv.unreadCount > 0 && (
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </div>
            )}
          </button>
        ))
      )}
    </div>
  );
};

export default DirectMessages;