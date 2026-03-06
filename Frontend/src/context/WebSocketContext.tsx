import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  sendDirectMessage: (to: string, text: string, messageId: string) => void;
  onNewDirectMessage: (callback: (data: any) => void) => void;
  onStatusChange: (callback: (data: any) => void) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const newMessageCallbacks = useRef<((data: any) => void)[]>([]);
  const statusChangeCallbacks = useRef<((data: any) => void)[]>([]);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = () => {
    if (!user) {
      console.log('❌ No user, cannot connect WebSocket');
      return;
    }

    // Get token from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');

    if (!token) {
      console.log('❌ No token found in cookies');
      console.log('🍪 Cookies:', document.cookie);
      return;
    }

    console.log('🔄 Connecting to WebSocket...');
    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connection opened');
      console.log('🔐 Sending auth with token...');
      ws.send(JSON.stringify({ type: 'auth', token }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WS Message:', data);

        switch (data.type) {
          case 'auth-success':
            setIsConnected(true);
            console.log('✅ WebSocket authenticated:', data.payload?.username);
            break;

          case 'auth-error':
            console.error('❌ WebSocket auth failed:', data.payload?.error);
            setIsConnected(false);
            break;

          case 'new-dm':
            console.log('💬 New DM received:', data.payload);
            newMessageCallbacks.current.forEach(cb => cb(data.payload));
            break;

          case 'status-change':
            console.log(`👤 Status change: ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
            statusChangeCallbacks.current.forEach(cb => cb(data));
            break;

          case 'dm-delivered':
            console.log('✅ Message delivered:', data.payload);
            break;

          default:
            console.log('ℹ️ Unknown WS message type:', data.type);
        }
      } catch (error) {
        console.error('❌ WebSocket message parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
      
      // Auto reconnect after 3 seconds
      if (user) {
        console.log('🔄 Will reconnect in 3 seconds...');
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };
  };

  useEffect(() => {
    if (user) {
      connect();
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  const sendDirectMessage = (to: string, text: string, messageId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'dm',
        to,
        text,
        messageId,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(message));
      console.log('📤 Sent DM via WebSocket:', message);
    } else {
      console.error('❌ WebSocket not connected, cannot send message');
    }
  };

  const onNewDirectMessage = (callback: (data: any) => void) => {
    newMessageCallbacks.current.push(callback);
  };

  const onStatusChange = (callback: (data: any) => void) => {
    statusChangeCallbacks.current.push(callback);
  };

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setTimeout(connect, 500);
  };

  return (
    <WebSocketContext.Provider 
      value={{ 
        isConnected, 
        sendDirectMessage, 
        onNewDirectMessage, 
        onStatusChange,
        reconnect
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