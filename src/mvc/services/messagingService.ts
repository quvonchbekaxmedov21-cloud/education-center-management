import { supabase } from '../../lib/supabase';
import type {
  ParentRecipientView,
  SendParentMessageInput,
  SentMessageView,
} from '../models/messagingModel';

export const messagingService = {
  async listParentRecipients(): Promise<ParentRecipientView[]> {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, surname, parent_name, parent_email, parent_phone')
      .order('name');

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      student_id: row.id,
      student_name: `${row.name} ${row.surname}`,
      parent_name: row.parent_name || 'Parent',
      parent_email: row.parent_email,
      parent_phone: row.parent_phone,
    }));
  },

  async listRecentSent(limit = 10): Promise<SentMessageView[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('id, sent_date, subject, message')
      .order('sent_date', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      sent_date: row.sent_date,
      channel: row.subject?.includes('[SMS]') ? 'sms' : 'email',
      recipient: row.subject?.split('to: ')[1] || 'Parent',
      subject: row.subject,
      message: row.message,
    }));
  },

  async sendToParents(input: SendParentMessageInput): Promise<void> {
    const recipients = await this.listParentRecipients();
    const selectedRecipients = recipients.filter((r) => input.student_ids.includes(r.student_id));

    const { data: senderUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', input.sender_email)
      .maybeSingle();

    const rows = selectedRecipients.map((recipient) => ({
      from_user_id: senderUser?.id || null,
      to_user_id: null,
      subject: `[${input.channel.toUpperCase()}] to: ${recipient.parent_name} (${recipient.student_name})`,
      message: input.body,
      status: 'sent',
    }));

    if (rows.length === 0) return;

    const { error } = await supabase.from('messages').insert(rows);
    if (error) throw new Error(error.message);
  },
};
