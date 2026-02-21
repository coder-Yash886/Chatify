import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketService } from '../utils/websocket';
import { useAuth } from './AuthContext';

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

interface WebSocketContextType {
  ws: WebSocketService | null;
  isConnected: boolean;
  currentRoom: string | null;
  messages: Message[];
  typingUsers: string[];
  roomUsers: string[];
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  sendTyping: () => void;
  sendStopTyping: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [ws, setWs] = useState<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && !ws) {
      const websocket = new WebSocketService(WS_URL);
      
      websocket.connect().then(() => {
        setIsConnected(true);
        
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        
        if (token) {
          websocket.send('auth', { token });
        }
      }).catch((error) => {
        console.error('WebSocket connection failed:', error);
      });

      websocket.on('auth-success', (payload) => {
        console.log('✅ WebSocket authenticated:', payload.username);
      });

      websocket.on('auth-error', (payload) => {
        console.error('❌ WebSocket auth error:', payload.error);
      });

      websocket.on('room-history', (payload) => {
        setMessages(payload);
      });

      websocket.on('room-users', (payload) => {
        setRoomUsers(payload);
      });

      websocket.on('new-message', (payload) => {
        setMessages((prev) => [...prev, payload]);
      });

      websocket.on('user-joined', (payload) => {
        console.log(`👋 ${payload.username} joined`);
      });

      websocket.on('user-left', (payload) => {
        console.log(`👋 ${payload.username} left`);
      });

      websocket.on('user-typing', (payload) => {
        setTypingUsers((prev) => {
          if (!prev.includes(payload.username)) {
            return [...prev, payload.username];
          }
          return prev;
        });
      });

      websocket.on('user-stop-typing', (payload) => {
        setTypingUsers((prev) => prev.filter((u) => u !== payload.username));
      });

      websocket.on('error', (payload) => {
        console.error('❌ WebSocket error:', payload.error);
      });

      setWs(websocket);
    }

    return () => {
      if (ws && !isAuthenticated) {
        ws.disconnect();
        setWs(null);
        setIsConnected(false);
      }
    };
  }, [isAuthenticated]);

  const joinRoom = (roomId: string) => {
    if (ws) {
      ws.send('join-room', { roomId });
      setCurrentRoom(roomId);
      setMessages([]);
      setTypingUsers([]);
    }
  };

  const leaveRoom = () => {
    if (ws) {
      ws.send('leave-room');
      setCurrentRoom(null);
      setMessages([]);
      setTypingUsers([]);
    }
  };

  const sendMessage = (text: string) => {
    if (ws && currentRoom) {
      ws.send('send-message', { text });
    }
  };

  const sendTyping = () => {
    if (ws && currentRoom) {
      ws.send('typing');
    }
  };

  const sendStopTyping = () => {
    if (ws && currentRoom) {
      ws.send('stop-typing');
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        isConnected,
        currentRoom,
        messages,
        typingUsers,
        roomUsers,
        joinRoom,
        leaveRoom,
        sendMessage,
        sendTyping,
        sendStopTyping,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};