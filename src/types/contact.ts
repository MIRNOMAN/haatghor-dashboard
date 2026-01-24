export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'READ' | 'REPLIED' | 'RESOLVED';
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReplyContactInput {
  id: string;
  reply: string;
}
