import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../utils/auth';

interface User {
  id: string;
  name: string;
  isOnline: boolean;
  currentPath?: string;
  lastActive?: Date;
}

interface SocketContextData {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: User[];
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextData | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    // Determine API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Create socket instance but don't connect yet (autoConnect: false)
    const socketInstance = io(API_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    // Event Listeners
    socketInstance.on('connect', () => {
      // console.log('💚 [Frontend] Socket Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      // console.log('💔 [Frontend] Socket Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('⚠️ [Frontend] Socket Connection Error:', err.message);
    });

    // Presence Events
    socketInstance.on('presence_sync', (users: User[]) => {
      // console.log('👥 [Frontend] Presence Sync:', users);
      setOnlineUsers(users);
    });

    socketInstance.on('user_online', (user: User) => {
      // console.log('🟢 [Frontend] User Online:', user);
      setOnlineUsers((prev) => {
        // Remove existing if present to avoid dupes, then add
        const filtered = prev.filter(u => u.id !== user.id);
        return [...filtered, user];
      });
    });

    socketInstance.on('user_offline', (userId: string) => {
      // console.log('⚫ [Frontend] User Offline:', userId);
      setOnlineUsers((prev) => prev.filter(u => u.id !== userId));
    });

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Connection Management
  useEffect(() => {
    const token = getToken();
    
    if (socket && token) {
      if (!socket.connected) {
        // Authenticate with query/auth handshake
        socket.auth = { token };
        socket.connect();
      }
    } else if (socket && !token) {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [socket]); // Re-run if socket instance changes or (implicitly) if component remounts and checks auth

  // Manual Exposed Methods
  const connect = () => {
    const token = getToken();
    if (socket && token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket?.connected) {
      socket.disconnect();
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
