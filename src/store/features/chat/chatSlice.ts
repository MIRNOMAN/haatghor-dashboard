import { baseApi } from '@/store/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string | null;
  role: string;
  status: string;
}

export interface Message {
  id: string;
  content: string | null;
  senderId: string;
  roomId: string;
  createdAt: string;
  fileUrl: string[];
  isRead: boolean;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
  };
}

export interface ChatRoom {
  id: string;
  roomType: 'SINGLE' | 'GROUP';
  name: string;
  photo: string | null;
  lastMessage: {
    id: string;
    content: string | null;
    createdAt: string;
    senderId: string;
    isRead: boolean;
    fileUrl?: string[];
  } | null;
  unreadCount: number;
  participants: string[];
  createdAt: string;
  updatedAt: string;
  otherUser?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
    status: string;
  };
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users for starting chats
    getUsersForChat: builder.query<
      { data: User[]; meta: any },
      { searchTerm?: string; page?: number; limit?: number }
    >({
      query: ({ searchTerm, page = 1, limit = 20 }) => ({
        url: '/chat/users',
        params: { searchTerm, page, limit },
      }),
      transformResponse: (response: { data: { data: User[]; meta: any } }) => response.data,
      providesTags: ['Users'],
    }),

    // Get all chat rooms
    getChatRooms: builder.query<ChatRoom[], void>({
      query: () => '/chat/rooms',
      transformResponse: (response: { data: ChatRoom[] }) => response.data,
      providesTags: ['ChatRooms'],
    }),

    // Get messages for a specific room
    getRoomMessages: builder.query<
      { data: Message[]; meta: any },
      { roomId: string; page?: number; limit?: number }
    >({
      query: ({ roomId, page = 1, limit = 50 }) => ({
        url: `/chat/rooms/${roomId}/messages`,
        params: { page, limit },
      }),
      transformResponse: (response: { data: { data: Message[]; meta: any } }) => response.data,
      providesTags: (result, error, { roomId }) => [{ type: 'Messages', id: roomId }],
    }),

    // Upload file for chat
    uploadChatFile: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/chat/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: { url: string } }) => response.data,
    }),

    // Create or get existing room
    createOrGetRoom: builder.mutation<{ data: ChatRoom }, { receiverId: string }>({
      query: (body) => ({
        url: '/chat/rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ChatRooms'],
    }),
  }),
});

export const {
  useGetUsersForChatQuery,
  useGetChatRoomsQuery,
  useGetRoomMessagesQuery,
  useUploadChatFileMutation,
  useCreateOrGetRoomMutation,
} = chatApi;
