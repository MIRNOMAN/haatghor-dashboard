'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquarePlus, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ChatRoom } from '@/store/features/chat/chatSlice';
import { NewChatDialog } from './NewChatDialog';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onRoomSelect: (room: ChatRoom) => void;
  isLoading: boolean;
  onlineUserIds: string[];
}

export function ChatSidebar({
  rooms,
  selectedRoomId,
  onRoomSelect,
  isLoading,
  onlineUserIds,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewRoomCreated = (roomId: string) => {
    const newRoom = rooms.find((r) => r.id === roomId);
    if (newRoom) {
      onRoomSelect(newRoom);
    }
  };

  const isUserOnline = (room: ChatRoom) => {
    if (room.roomType === 'SINGLE' && room.otherUser) {
      return onlineUserIds.includes(room.otherUser.id);
    }
    return false;
  };

  return (
    <>
      <div className="w-80 border-r flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowNewChatDialog(true)}
              title="Start new chat"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {isLoading && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading conversations...</span>
            </div>
          )}

          {!isLoading && filteredRooms.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p className="mb-2">No conversations yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewChatDialog(true)}
              >
                Start a chat
              </Button>
            </div>
          )}

          {filteredRooms.map((room) => {
            const isOnline = isUserOnline(room);
            const lastMessageText = room.lastMessage?.content || 
              (room.lastMessage?.fileUrl && room.lastMessage.fileUrl.length > 0 ? '📎 File' : 'No messages yet');
            
            return (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room)}
                className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                  selectedRoomId === room.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={room.photo || undefined} />
                      <AvatarFallback>
                        {room.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {room.name}
                      </h3>
                      {room.lastMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(room.lastMessage.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessageText}
                    </p>
                    
                    {room.unreadCount > 0 && (
                      <div className="mt-1">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {room.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onRoomCreated={handleNewRoomCreated}
      />
    </>
  );
}
