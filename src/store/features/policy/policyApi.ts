import { baseApi } from "@/store/api";
import { PrivacyPolicy, CreatePolicyInput, UpdatePolicyInput } from "@/types/policy";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all policies
    getAllPolicies: builder.query<
      T_ApiResponseForPagination<PrivacyPolicy[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        return `/privacy-policy?${params.toString()}`;
      },
      providesTags: ['Policy'],
    }),

    // Get active policy
    getActivePolicy: builder.query<T_ApiResponse<PrivacyPolicy>, void>({
      query: () => '/privacy-policy/active',
      providesTags: ['Policy'],
    }),

    // Get policy by ID
    getPolicyById: builder.query<T_ApiResponse<PrivacyPolicy>, string>({
      query: (id) => `/privacy-policy/${id}`,
      providesTags: ['Policy'],
    }),

    // Create policy
    createPolicy: builder.mutation<T_ApiResponse<PrivacyPolicy>, CreatePolicyInput>({
      query: (data) => ({
        url: '/privacy-policy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Policy'],
    }),

    // Update policy
    updatePolicy: builder.mutation<T_ApiResponse<PrivacyPolicy>, UpdatePolicyInput>({
      query: ({ id, ...data }) => ({
        url: `/privacy-policy/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Policy'],
    }),

    // Delete policy
    deletePolicy: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/privacy-policy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Policy'],
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetActivePolicyQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} = policyApi;
