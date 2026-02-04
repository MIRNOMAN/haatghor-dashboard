import { baseApi } from "@/store/api";
import { ContactMessage, ReplyContactInput } from "@/types/contact";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";
import { ContactStatusFilter } from "@/app/(default)/contact/page";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contact messages
    getAllContactMessages: builder.query<
      T_ApiResponseForPagination<ContactMessage[]>,
      { page?: number; limit?: number; status?: ContactStatusFilter }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());

        if (status) {
          params.set("status", status);
        }

        return `/contact?${params.toString()}`;
      },
      providesTags: ["Contact"],
    }),

    // Get contact message by ID
    getContactMessageById: builder.query<T_ApiResponse<ContactMessage>, string>(
      {
        query: (id) => `/contact/${id}`,
        providesTags: ["Contact"],
      },
    ),

    // Reply to contact message
    replyToContact: builder.mutation<
      T_ApiResponse<ContactMessage>,
      ReplyContactInput
    >({
      query: ({ id, reply }) => ({
        url: `/contact/${id}/reply`,
        method: "PUT",
        body: { reply },
      }),
      invalidatesTags: ["Contact"],
    }),

    // Update contact status
    updateContactStatus: builder.mutation<
      T_ApiResponse<ContactMessage>,
      { id: string; status: ContactStatusFilter }
    >({
      query: ({ id, status }) => ({
        url: `/contact/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Contact"],
    }),

    // Delete contact message
    deleteContactMessage: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useGetAllContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useReplyToContactMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMessageMutation,
} = contactApi;
