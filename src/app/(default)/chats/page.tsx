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
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const { data: roomsData, isLoading: isLoadingRooms, refetch: refetchRooms } = useGetChatRoomsQuery();

  const {
    isConnected,
    conversations: wsConversations,
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
    setMessages([]); // Clear previous messages
    
    if (room.id) {
      console.log('📡 Subscribing to room:', room.id);
      subscribe(room.id, (newMessages) => {
        console.log('📨 Messages updated:', newMessages.length);
        setMessages(newMessages);
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Chat with users in real-time
        </p>
      </div>

      <Card className="h-[calc(100vh-200px)] flex overflow-hidden">
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
      </Card>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
