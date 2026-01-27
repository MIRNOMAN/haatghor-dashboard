'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, Loader2 } from 'lucide-react';
import { useChatWebSocket } from '@/utils/useChatWebSocket';
import { useAppSelector } from '@/store/hookts';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  createdAt: string;
  fileUrl?: string[];
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
}

export default function ChatsPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const {
    isConnected,
    conversations: wsConversations,
    sendMessage: sendWSMessage,
    subscribe,
    error,
  } = useChatWebSocket();

  // Update conversations when WebSocket provides them
  useEffect(() => {
    console.log('📊 WebSocket conversations updated:', wsConversations.length);
    // Always update conversations, even if empty
    setConversations(wsConversations);
    console.log('✅ Conversations set in dashboard:', wsConversations);
  }, [wsConversations]);

  // Log connection status
  useEffect(() => {
    console.log('🔌 Dashboard WebSocket status:', {
      isConnected,
      conversationCount: conversations.length,
      selectedConversation: selectedConversation?.name
    });
  }, [isConnected, conversations.length, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('🎯 Selected conversation:', conversation.name, conversation.id);
    setSelectedConversation(conversation);
    setMessages([]); // Clear previous messages
    
    if (conversation.id) {
      console.log('📡 Subscribing to room:', conversation.id);
      subscribe(conversation.id, (newMessages) => {
        console.log('📨 Messages updated in dashboard:', newMessages.length);
        setMessages(newMessages);
      });
    }
  };

  const handleSendMessage = () => {
    console.log('📤 Dashboard sending message:', messageInput);
    if (messageInput.trim() && selectedConversation) {
      sendWSMessage(messageInput, []);
      setMessageInput('');
    } else {
      console.warn('⚠️ Cannot send:', {
        hasInput: !!messageInput.trim(),
        hasConversation: !!selectedConversation
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Support Chats</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer conversations and provide support
        </p>
      </div>

      <Card className="h-[calc(100vh-200px)] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
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

          <ScrollArea className="flex-1">
            {!isConnected && (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Connecting...</span>
              </div>
            )}

            {isConnected && filteredConversations.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            )}

            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.photo} />
                      <AvatarFallback>
                        {conversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="mt-1">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium">No conversation selected</p>
                <p className="text-sm mt-2">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.photo} />
                    <AvatarFallback>
                      {selectedConversation.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.isActive ? 'Active now' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages yet</p>
                  </div>
                )}

                {messages.map((message) => {
                  const isMe = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
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

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || !isConnected}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
