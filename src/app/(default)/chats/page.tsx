'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useChatWebSocket } from '@/utils/useChatWebSocket';
import { useGetChatRoomsQuery } from '@/store/features/chat/chatSlice';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import type { ChatRoom, Message } from '@/store/features/chat/chatSlice';

export default function ChatsPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const { data: roomsData, isLoading: isLoadingRooms, refetch: refetchRooms } = useGetChatRoomsQuery();

  const {
    isConnected,
    conversations: wsConversations,
    messages,
    sendMessage: sendWSMessage,
    subscribe,
    error,
  } = useChatWebSocket();

  // Merge REST API rooms with WebSocket conversations
  const rooms: ChatRoom[] = roomsData || [];

  // Extract online user IDs from WebSocket conversations
  useEffect(() => {
    if (wsConversations.length > 0) {
      const onlineIds = wsConversations
        .filter((conv) => conv.isActive)
        .map((conv) => {
          // Extract the other user ID from conversation (not current user)
          // This is a simplified approach - adjust based on your conversation structure
          return conv.id;
        });
      setOnlineUserIds(onlineIds);
    }
  }, [wsConversations]);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
    
    if (room.id) {
      console.log('📡 Subscribing to room:', room.id);
      subscribe(room.id, (newMessages) => {
        console.log('📨 Messages updated:', newMessages.length);
      });
    }
  };

  const handleSendMessage = (content: string, fileUrls: string[] = []) => {
    console.log('📤 Sending message:', { content, fileUrls });
    if (selectedRoom) {
      sendWSMessage(content, fileUrls);
    }
  };

  // Refetch rooms when WebSocket connects
  useEffect(() => {
    if (isConnected) {
      refetchRooms();
    }
  }, [isConnected, refetchRooms]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Page Header - Minimal */}
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Chat with users in real-time • {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          rooms={rooms}
          selectedRoomId={selectedRoom?.id || null}
          onRoomSelect={handleRoomSelect}
          isLoading={isLoadingRooms}
          onlineUserIds={onlineUserIds}
        />

        <ChatPanel
          room={selectedRoom}
          messages={messages}
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
          onlineUserIds={onlineUserIds}
        />
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
