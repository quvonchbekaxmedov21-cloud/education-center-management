export type MessageChannel = 'email' | 'sms';

export interface ParentRecipientView {
  student_id: string;
  student_name: string;
  parent_name: string;
  parent_email?: string | null;
  parent_phone?: string | null;
}

export interface SendParentMessageInput {
  sender_email: string;
  student_ids: string[];
  channel: MessageChannel;
  body: string;
}

export interface SentMessageView {
  id: string;
  sent_date: string;
  channel: MessageChannel;
  recipient: string;
  subject?: string | null;
  message: string;
}
