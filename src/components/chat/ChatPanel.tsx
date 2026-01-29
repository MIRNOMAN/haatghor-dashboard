'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, Smile, Mic, Loader2, MoreVertical, Phone, Video } from 'lucide-react';
import { ChatRoom, Message, useUploadChatFileMutation } from '@/store/features/chat/chatSlice';
import { useAppSelector } from '@/store/hookts';

interface ChatPanelProps {
  room: ChatRoom | null;
  messages: Message[];
  onSendMessage: (content: string, fileUrls: string[]) => void;
  isConnected: boolean;
  onlineUserIds: string[];
}

export function ChatPanel({
  room,
  messages,
  onSendMessage,
  isConnected,
  onlineUserIds,
}: ChatPanelProps) {
  const [messageInput, setMessageInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  const [uploadFile, { isLoading: isUploading }] = useUploadChatFileMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const urls: string[] = [];
    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadFile(formData).unwrap();
        urls.push(result.url);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
    return urls;
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || !room) return;

    let fileUrls = uploadedFileUrls;
    
    // Upload files if any
    if (selectedFiles.length > 0) {
      fileUrls = await uploadFiles();
      setUploadedFileUrls(fileUrls);
    }

    onSendMessage(messageInput.trim(), fileUrls);
    setMessageInput('');
    setSelectedFiles([]);
    setUploadedFileUrls([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isUserOnline = room?.roomType === 'SINGLE' && room.otherUser 
    ? onlineUserIds.includes(room.otherUser.id)
    : false;

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-10 w-10 text-white" />
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No conversation selected</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a conversation from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header - Enhanced */}
      <div className="px-6 py-4 border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-14 w-14 border-2 border-gray-100 dark:border-gray-800">
                <AvatarImage src={room.photo || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                  {room.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isUserOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">{room.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${isUserOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isUserOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Voice call"
            >
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Video call"
            >
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="More options"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Send className="h-12 w-12 text-white" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Start the conversation!</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Send a message to begin chatting with {room.name}</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message, index) => {
            const isMe = message.senderId === user?.id;
            const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId;
            const senderName = message.sender 
              ? `${message.sender.firstName} ${message.sender.lastName}`.trim()
              : isMe ? 'You' : 'User';
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {!isMe && showAvatar && (
                  <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-gray-200 dark:border-gray-700">
                    <AvatarImage src={message.sender?.profilePhoto || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                      {senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                {!isMe && !showAvatar && <div className="w-10 flex-shrink-0" />}
                
                <div className={`max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!isMe && showAvatar && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-1">{senderName}</span>
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                    }`}
                  >
                    {message.content && (
                      <p className="text-[15px] whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    )}
                    
                    {message.fileUrl && message.fileUrl.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {message.fileUrl.map((url, index) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                          return (
                            <div key={index}>
                              {isImage ? (
                                <img
                                  src={url}
                                  alt="Attachment"
                                  className="rounded-lg max-w-full h-auto"
                                />
                              ) : (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm underline hover:no-underline"
                                >
                                  📎 File attachment
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <span
                    className={`text-xs px-1 ${
                      isMe
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-6 py-3 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <span className="text-lg">📎</span>
                <span className="truncate max-w-[200px] text-gray-700 dark:text-gray-300">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input - Enhanced */}
      <div className="px-6 py-4 border-t bg-white dark:bg-gray-900">
        {!isConnected && (
          <div className="mb-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Disconnected from chat server. Trying to reconnect...
            </p>
          </div>
        )}
        
        <div className="flex items-end gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected || isUploading}
            title="Attach file"
            className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isUploading}
              className="pr-12 h-12 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full focus:bg-white dark:focus:bg-gray-900 text-[15px]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Add emoji"
            >
              <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            title="Voice message"
          >
            <Mic className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={(!messageInput.trim() && selectedFiles.length === 0) || !isConnected || isUploading}
            size="icon"
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Send message"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
