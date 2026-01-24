export interface LoginInput {
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOTPInput {
  phone: string;
  otp: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}
