'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Loader2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
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
      <div className="w-[340px] border-r flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="px-5 py-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message</h2>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNewChatDialog(true)}
                title="Start new chat"
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-10 focus:bg-white dark:focus:bg-gray-900"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-blue-600" />
              <span className="text-sm">Loading conversations...</span>
            </div>
          )}

          {!isLoading && filteredRooms.length === 0 && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">No conversations yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewChatDialog(true)}
                className="rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start a chat
              </Button>
            </div>
          )}

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredRooms.map((room) => {
              const isOnline = isUserOnline(room);
              const lastMessageText = room.lastMessage?.content || 
                (room.lastMessage?.fileUrl && room.lastMessage.fileUrl.length > 0 ? '📎 File' : 'No messages yet');
              
              const messageDate = room.lastMessage?.createdAt 
                ? format(new Date(room.lastMessage.createdAt), 'dd MMM')
                : '';
              
              return (
                <div
                  key={room.id}
                  onClick={() => onRoomSelect(room)}
                  className={`px-5 py-4 cursor-pointer transition-all duration-200 ${
                    selectedRoomId === room.id 
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-600' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={room.photo || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {room.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-[15px] truncate">
                          {room.name}
                        </h3>
                        {messageDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {messageDate}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate leading-relaxed">
                        {lastMessageText}
                      </p>
                    </div>
                    
                    {room.unreadCount > 0 && (
                      <div className="flex-shrink-0">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center inline-block">
                          {room.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
