import { baseApi } from "@/store/api";
import { TUser } from "@/types";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin)
    getAllUsers: builder.query<
      T_ApiResponseForPagination<TUser[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        
        return `/users?${params.toString()}`;
      },
      providesTags: ['Users'],
    }),

    // Get user by ID
    getUserById: builder.query<T_ApiResponse<TUser>, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users'],
    }),

    // Update user role
    updateUserRole: builder.mutation<
      T_ApiResponse<TUser>,
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/users/user-role/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),

    // Update user status
    updateUserStatus: builder.mutation<
      T_ApiResponse<TUser>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/users/user-status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),

    // Undelete user
    undeleteUser: builder.mutation<T_ApiResponse<TUser>, string>({
      query: (id) => ({
        url: `/users/undelete-user/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useUndeleteUserMutation,
} = usersApi;
