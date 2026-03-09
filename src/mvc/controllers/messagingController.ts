import type {
  SendParentMessageInput,
  ParentRecipientView,
  SentMessageView,
} from '../models/messagingModel';
import { messagingService } from '../services/messagingService';

export const messagingController = {
  async listRecipients(): Promise<ParentRecipientView[]> {
    return messagingService.listParentRecipients();
  },

  async listRecent(): Promise<SentMessageView[]> {
    return messagingService.listRecentSent();
  },

  async send(input: SendParentMessageInput): Promise<void> {
    if (!input.sender_email) throw new Error('Sender email is required');
    if (!input.student_ids.length) throw new Error('Select at least one recipient');
    if (!input.body.trim()) throw new Error('Message body is required');
    return messagingService.sendToParents(input);
  },
};
