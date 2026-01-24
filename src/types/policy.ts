export interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyInput {
  title: string;
  content: string;
  version?: string;
  isActive?: boolean;
}

export interface UpdatePolicyInput extends Partial<CreatePolicyInput> {
  id: string;
}
