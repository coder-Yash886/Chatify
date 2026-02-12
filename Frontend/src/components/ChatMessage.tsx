import React from 'react';
import { format } from 'date-fns';
import type { Message } from '../types';
import { useAuth } from '../context/AuthContext';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isOwn = user?.username === message.username;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        <div className={`
          px-4 py-2 rounded-2xl
          ${isOwn 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
          }
        `}>
          {!isOwn && (
            <div className="text-xs font-semibold mb-1 text-primary-600">
              {message.username}
            </div>
          )}
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </div>
          <div className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;