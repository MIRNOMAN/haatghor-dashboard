import { baseApi } from "@/store/api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  userId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  userId?: string;
}

export interface UpdateNotificationInput extends Partial<CreateNotificationInput> {
  isRead?: boolean;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications with pagination
    getNotifications: builder.query<
      {
        data: Notification[];
        meta: { total: number; page: number; limit: number };
      },
      { page?: number; limit?: number; userId?: string; isRead?: boolean }
    >({
      query: ({ page = 1, limit = 10, userId, isRead }) => ({
        url: "/notifications",
        params: { page, limit, userId, isRead },
      }),
      transformResponse: (response: {
        data: { data: Notification[]; meta: any };
      }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Notifications" as const,
                id,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    // Get single notification by ID
    getNotification: builder.query<Notification, string>({
      query: (id) => `/notifications/${id}`,
      transformResponse: (response: { data: Notification }) => response.data,
      providesTags: (result, error, id) => [{ type: "Notifications", id }],
    }),

    // Create notification
    createNotification: builder.mutation<Notification, CreateNotificationInput>(
      {
        query: (body) => ({
          url: "/notifications",
          method: "POST",
          body,
        }),
        transformResponse: (response: { data: Notification }) => response.data,
        invalidatesTags: [{ type: "Notifications", id: "LIST" }],
      },
    ),

    // Update notification
    updateNotification: builder.mutation<
      Notification,
      { id: string; data: UpdateNotificationInput }
    >({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Notification }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
      ],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: Notification }) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
      ],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    // Delete notification
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
      ],
    }),

    // Send broadcast notification
    sendBroadcastNotification: builder.mutation<
      void,
      { title: string; message: string; type: string }
    >({
      query: (body) => ({
        url: "/notifications/broadcast",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useSendBroadcastNotificationMutation,
} = notificationsApi;
