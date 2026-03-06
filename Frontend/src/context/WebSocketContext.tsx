import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  sendDirectMessage: (to: string, text: string, messageId: string) => void;
  onNewDirectMessage: (callback: (data: any) => void) => void;
  onStatusChange: (callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const newMessageCallbacks = useRef<((data: any) => void)[]>([]);
  const statusChangeCallbacks = useRef<((data: any) => void)[]>([]);

  useEffect(() => {
    if (!user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      console.log('❌ No token available for WebSocket');
      return;
    }

    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      // Authenticate
      ws.send(JSON.stringify({ type: 'auth', token }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WS received:', data.type);

        switch (data.type) {
          case 'auth-success':
            setIsConnected(true);
            console.log('✅ WebSocket authenticated:', data.payload.username);
            break;

          case 'auth-error':
            console.error('❌ WebSocket auth failed:', data.payload.error);
            setIsConnected(false);
            break;

          case 'new-dm':
            console.log('💬 New DM from:', data.payload.fromUsername);
            newMessageCallbacks.current.forEach(cb => cb(data.payload));
            break;

          case 'status-change':
            console.log(`👤 ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
            statusChangeCallbacks.current.forEach(cb => cb(data));
            break;

          case 'dm-delivered':
            console.log('✅ Message delivered:', data.payload);
            break;

          case 'dm-typing':
            // Handle typing indicator
            break;

          default:
            console.log('Unknown WS message:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  const sendDirectMessage = (to: string, text: string, messageId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'dm',
          to,
          text,
          messageId,
          timestamp: new Date().toISOString(),
        })
      );
      console.log('📤 Sent DM via WebSocket');
    }
  };

  const onNewDirectMessage = (callback: (data: any) => void) => {
    newMessageCallbacks.current.push(callback);
  };

  const onStatusChange = (callback: (data: any) => void) => {
    statusChangeCallbacks.current.push(callback);
  };

  return (
    <WebSocketContext.Provider 
      value={{ 
        isConnected, 
        sendDirectMessage, 
        onNewDirectMessage, 
        onStatusChange 
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