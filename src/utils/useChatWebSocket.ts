'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppSelector } from '@/store/hookts';
import { BASEAPI } from './baseApi';

interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  createdAt: string;
  fileUrl?: string[];
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
  };
}

interface Conversation {
  id: string;
  name: string;
  photo: string;
  isActive: boolean;
  unreadCount: number;
  lastMessage: {
    content: string;
    createdAt: string;
  };
  createdAt: string;
  countIncreaseBy?: number;
}

export function useChatWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const messageCallbackRef = useRef<((messages: Message[]) => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    console.log('🔌 Dashboard WebSocket - Attempting connection...');
    console.log('🔑 Dashboard - Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    console.log('👤 Dashboard - User:', user ? `${user.firstName} (${user.role})` : 'MISSING');
    
    if (!token) {
      console.log('❌ Dashboard WebSocket: No token available - cannot connect');
      setError('Please log in to use chat');
      setIsConnected(false);
      return;
    }

    try {
      // Get the base URL using the same function as API calls
      const serverUrl = BASEAPI();
      console.log('📡 Dashboard - Base API URL:', serverUrl);
      
      // Convert HTTP to WebSocket URL
      const wsUrl = serverUrl.replace(/^http/, 'ws').replace(/\/api\/v1$/, '');
      console.log('📡 Dashboard - WebSocket URL:', wsUrl);
      console.log('🔌 Dashboard - Creating WebSocket connection...');
      
      // Create WebSocket connection with token in URL as query parameter
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);

      ws.onopen = () => {
        console.log('✅ Dashboard WebSocket connected successfully!');
        setIsConnected(true);
        setError(null);
        
        // Backend automatically sends conversation list on connect
        console.log('📋 Waiting for conversation list from server...');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 Dashboard received WebSocket message:', data.type, data);
          
          switch (data.type) {
            case 'conversation-list':
              console.log('📋 Received conversation list:', data.conversations?.length || 0, 'conversations');
              if (data.conversations) {
                setConversations(data.conversations);
              }
              break;

            case 'past-messages':
              console.log('📜 Received past messages:', data.messages?.length || 0, 'messages');
              if (data.messages) {
                // Reverse to show oldest first
                const sortedMessages = [...data.messages].reverse();
                setMessages(sortedMessages);
                if (messageCallbackRef.current) {
                  messageCallbackRef.current(sortedMessages);
                }
              }
              setCurrentRoomId(data.roomId);
              break;
              
            case 'new-message':
              console.log('💬 Received new message:', data.message);
              if (data.message) {
                setMessages((prev) => {
                  const newMessages = [...prev, data.message];
                  if (messageCallbackRef.current) {
                    messageCallbackRef.current(newMessages);
                  }
                  return newMessages;
                });
              }
              break;

            case 'new-conversation':
              console.log('🆕 Received new/updated conversation:', data.conversations);
              if (data.conversations) {
                setConversations((prev) => {
                  const existingIndex = prev.findIndex(c => c.id === data.conversations.id);
                  if (existingIndex >= 0) {
                    // Update existing conversation
                    console.log('Updating existing conversation at index:', existingIndex);
                    const updated = [...prev];
                    const existing = updated[existingIndex];
                    updated[existingIndex] = {
                      ...existing,
                      ...data.conversations,
                      unreadCount: existing.unreadCount + (data.conversations.countIncreaseBy || 0),
                    };
                    // Move to top
                    return [updated[existingIndex], ...updated.slice(0, existingIndex), ...updated.slice(existingIndex + 1)];
                  } else {
                    // Add new conversation
                    console.log('Adding new conversation');
                    return [data.conversations, ...prev];
                  }
                });
              }
              break;
              
            case 'error':
              console.error('❌ WebSocket error from server:', data.message);
              setError(data.message);
              break;
              
            default:
              console.log('❓ Unknown message type:', data.type, data);
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('❌ Dashboard WebSocket error:', event);
        setError('Failed to connect to chat server');
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('🔴 Dashboard WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        setIsConnected(false);
        
        // Only reconnect if we have a token and it wasn't a clean close
        if (token && event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Dashboard attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to connect');
    }
  }, [token, user]);

  useEffect(() => {
    console.log('🎬 Dashboard WebSocket hook initialized');
    console.log('🔑 Has token:', !!token);
    console.log('👤 Has user:', !!user);
    
    if (token && user) {
      console.log('✅ Dashboard has auth, connecting...');
      connect();
    } else {
      console.log('⏳ Dashboard waiting for authentication...');
    }

    return () => {
      console.log('🧹 Dashboard WebSocket cleanup');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, token, user]);

  const subscribe = useCallback((roomId: string, onMessage: (messages: Message[]) => void) => {
    console.log('📌 Dashboard subscribing to room:', roomId);
    messageCallbackRef.current = onMessage;
    setMessages([]); // Clear previous messages
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending subscribe request to room:', roomId);
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        roomId,
      }));
    } else {
      console.warn('⚠️ Cannot subscribe - WebSocket not ready. State:', wsRef.current?.readyState);
      
      // Retry after a short delay
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          console.log('🔄 Retrying subscribe to room:', roomId);
          wsRef.current.send(JSON.stringify({
            type: 'subscribe',
            roomId,
          }));
        }
      }, 1000);
    }
  }, []);

  const sendMessage = useCallback((content: string, fileUrl: string[] = []) => {
    console.log('📨 Dashboard attempting to send message:', {content, roomId: currentRoomId});
    
    if (!currentRoomId) {
      const errorMsg = 'No chat room selected';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message via WebSocket');
      wsRef.current.send(JSON.stringify({
        type: 'send-message',
        content,
        fileUrl,
        roomId: currentRoomId,
      }));
      setError(null);
    } else {
      const errorMsg = 'WebSocket not connected';
      console.error('❌', errorMsg, 'ReadyState:', wsRef.current?.readyState);
      setError(errorMsg);
    }
  }, [currentRoomId]);

  const readMessages = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'read-message',
      }));
    }
  }, []);

  return {
    isConnected,
    error,
    conversations,
    messages,
    subscribe,
    sendMessage,
    readMessages,
    currentRoomId,
  };
}
