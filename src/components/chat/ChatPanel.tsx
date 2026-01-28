'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
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
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No conversation selected</p>
          <p className="text-sm mt-2">
            Choose a conversation or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={room.photo || undefined} />
              <AvatarFallback>
                {room.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isUserOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{room.name}</h2>
            <p className="text-sm text-muted-foreground">
              {isUserOnline ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((message) => {
          const isMe = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={message.sender?.profilePhoto || undefined} />
                  <AvatarFallback>
                    {message.sender?.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isMe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap break-words">
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
                              className="rounded max-w-full h-auto"
                            />
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm underline"
                            >
                              <Paperclip className="h-4 w-4" />
                              File attachment
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <p
                  className={`text-xs mt-1 ${
                    isMe
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t bg-muted/50">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background rounded px-2 py-1 text-sm"
              >
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="hover:bg-accent rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
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
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected || isUploading}
            className="flex-1"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={(!messageInput.trim() && selectedFiles.length === 0) || !isConnected || isUploading}
            size="icon"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-destructive mt-2">
            Disconnected from chat server. Trying to reconnect...
          </p>
        )}
      </div>
    </div>
  );
}

function MessageSquarePlus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}
