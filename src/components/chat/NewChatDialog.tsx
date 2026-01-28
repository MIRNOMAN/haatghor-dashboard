'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2 } from 'lucide-react';
import { useGetUsersForChatQuery, useCreateOrGetRoomMutation, User } from '@/store/features/chat/chatSlice';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated: (roomId: string) => void;
}

export function NewChatDialog({ open, onOpenChange, onRoomCreated }: NewChatDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: usersData, isLoading } = useGetUsersForChatQuery({ searchTerm, limit: 20 });
  const [createOrGetRoom, { isLoading: isCreatingRoom }] = useCreateOrGetRoomMutation();

  const handleUserSelect = async (user: User) => {
    try {
      const result = await createOrGetRoom({ receiverId: user.id }).unwrap();
      onRoomCreated(result.data.id);
      onOpenChange(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start a New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px]">
            {isLoading && (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {!isLoading && usersData?.data && usersData.data.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No users found
              </div>
            )}

            {usersData?.data && usersData.data.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user.profilePhoto || undefined} />
                  <AvatarFallback>
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user.role.toLowerCase()}
                </div>
              </div>
            ))}
          </ScrollArea>

          {isCreatingRoom && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Creating chat...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
