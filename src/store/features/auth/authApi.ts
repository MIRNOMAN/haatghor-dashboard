/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/store/api";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //admin register --done
    createAdminLogin: build.mutation({
      query: (data: any) => {
        return {
          url: `/auth/login`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    forgotPassword : build.mutation({
      query: (data: any) => {
        return {
          url: `/auth/forget-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    otpVerification : build.mutation({
      query: (data: any) => {
        return {
          url: `/auth/verify-reset-otp`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resendOtp : build.mutation({
      query: (data: any) => {
        return {
          url: `/auth/resend-otp`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    newPassword: build.mutation({
      query: (data: any) => {
        return {
          url: `/auth/reset-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    updateAdminProfile: build.mutation({
      query: (data) => {
        return {
          url: `/users/update-profile`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    getMyProfile: build.query({
      query: () => {
        return {
          url: `/users/me`,
          method: "GET",
        };
      },
      providesTags: ["Auth"],
    }),
    updateProfileImage: build.mutation({
      query: (data) => {
        return {
          url: `/users/update-profile-image`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    getTopUsers: build.query({
      query: () => {
        return {
          url: `/users?role=User`,
          method: "GET",
        };
      },
      providesTags: ["Auth"],
    }),
    changePasword: build.mutation({
      query: (data) => {
        return {
          url: `/auth/change-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useCreateAdminLoginMutation,
  useOtpVerificationMutation,
  useForgotPasswordMutation,
  useUpdateAdminProfileMutation,
  useGetMyProfileQuery,
  useUpdateProfileImageMutation,
  useGetTopUsersQuery,
  useChangePaswordMutation,
  useResendOtpMutation,
  useNewPasswordMutation
} = authApi;
