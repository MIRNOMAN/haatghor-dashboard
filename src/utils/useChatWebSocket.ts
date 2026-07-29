'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppSelector } from '@/store/hookts';
import type { Message } from '@/store/features/chat/chatSlice';
import { BASEAPI } from './baseApi';

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
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    // আগের কানেকশন থাকলে বন্ধ করে দাও
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return;
    }

    if (!token || !user) {
      setError('Waiting for authentication...');
      return;
    }

    try {
      const serverUrl = BASEAPI();
      
      // লোকালহোস্ট এবং প্রোডাকশন দুইটার জন্যই ইউআরএল ফরম্যাট করা
      // http://localhost:5000/api/v1 -> ws://localhost:5000/ws
      const wsUrl = serverUrl.replace(/^http/, 'ws').replace(/\/api\/v1$/, '/ws');
      
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);

      ws.onopen = () => {
        console.log('✅ WebSocket Connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'conversation-list':
              if (data.conversations) setConversations(data.conversations);
              break;

            case 'past-messages':
              if (data.messages) {
                const sortedMessages = [...data.messages].reverse();
                setMessages(sortedMessages);
                if (messageCallbackRef.current) messageCallbackRef.current(sortedMessages);
              }
              setCurrentRoomId(data.roomId);
              break;
              
            case 'new-message':
              if (data.message) {
                setMessages((prev) => {
                  const updated = [...prev, data.message];
                  if (messageCallbackRef.current) messageCallbackRef.current(updated);
                  return updated;
                });
              }
              break;

            case 'new-conversation':
              if (data.conversations) {
                setConversations((prev) => {
                  const existingIndex = prev.findIndex(c => c.id === data.conversations.id);
                  if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = { ...updated[existingIndex], ...data.conversations };
                    return [updated[existingIndex], ...updated.filter((_, i) => i !== existingIndex)];
                  }
                  return [data.conversations, ...prev];
                });
              }
              break;
              
            case 'error':
              setError(data.message);
              break;
          }
        } catch (err) {
          console.error('❌ Parsing Error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('❌ WS Error:', err);
        setError('Connection Error');
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log(`🔴 Disconnected (Code: ${event.code})`);
        
        // অটো-রিকানেক্ট লজিক (যদি ম্যানুয়ালি ক্লোজ না করা হয়)
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(3000 * (reconnectAttemptsRef.current + 1), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setError('Failed to create connection');
    }
  }, [token, user]);

  useEffect(() => {
    // Redux Persist থেকে ডাটা লোড হতে সময় দিতে ছোট একটি ডিলে
    const timer = setTimeout(() => {
      if (token && user) {
        connect();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close(1000);
    };
  }, [connect, token, user]);

  const subscribe = useCallback((roomId: string, onMessage: (messages: Message[]) => void) => {
    messageCallbackRef.current = onMessage;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', roomId }));
    }
  }, []);

  const sendMessage = useCallback((content: string, fileUrl: string[] = []) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && currentRoomId) {
      wsRef.current.send(JSON.stringify({
        type: 'send-message',
        content,
        fileUrl,
        roomId: currentRoomId,
      }));
    } else {
        setError("Can't send message: Not connected");
    }
  }, [currentRoomId]);

  return { isConnected, error, conversations, messages, subscribe, sendMessage, currentRoomId };
}
