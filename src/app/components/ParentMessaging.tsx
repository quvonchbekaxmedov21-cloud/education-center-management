import { useEffect, useState } from 'react';
import { Send, MessageSquare, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { messagingController } from '../../mvc/controllers/messagingController';
import type { MessageChannel, ParentRecipientView, SentMessageView } from '../../mvc/models/messagingModel';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

const MESSAGE_TEMPLATES: Array<{ title: string; body: string; channel: MessageChannel }> = [
  {
    title: 'Progress Update',
    channel: 'email',
    body: "Dear Parent, your child has shown strong progress this week. Please keep encouraging daily practice at home.",
  },
  {
    title: 'Payment Reminder',
    channel: 'email',
    body: 'Dear Parent, this is a reminder that this month\'s fee payment is pending. Please contact us if you need assistance.',
  },
  {
    title: 'Attendance Alert',
    channel: 'sms',
    body: 'Your child was absent today. Please contact the center if support is needed.',
  },
  {
    title: 'Meeting Invitation',
    channel: 'email',
    body: 'Dear Parent, we would like to schedule a parent-teacher meeting this week. Please reply with your preferred time.',
  },
];

export function ParentMessaging() {
  const { user } = useAuth();
  const [recipients, setRecipients] = useState<ParentRecipientView[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageChannel>('email');
  const [recentMessages, setRecentMessages] = useState<SentMessageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipientData, recentData] = await Promise.all([
        messagingController.listRecipients(),
        messagingController.listRecent(),
      ]);
      setRecipients(recipientData);
      setRecentMessages(recentData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load messaging data');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === recipients.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(recipients.map((r) => r.student_id));
    }
  };

  const handleSend = async () => {
    if (!user?.email) {
      toast.error('Unable to identify current user');
      return;
    }

    try {
      await messagingController.send({
        sender_email: user.email,
        student_ids: selectedStudents,
        channel: messageType,
        body: message,
      });

      toast.success(`Message saved and sent to ${selectedStudents.length} parent(s) via ${messageType}`);
      setMessage('');
      setSelectedStudents([]);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const applyTemplate = (template: { title: string; body: string; channel: MessageChannel }) => {
    setMessageType(template.channel);
    setMessage(template.body);
    toast.success(`${template.title} template applied`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Parent Messaging</h2>
        <p className="text-slate-600 mt-1">Send messages to parents about their children's progress</p>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="size-5 text-yellow-700 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Delivery Note</h3>
              <p className="text-sm text-yellow-800">
                Messages are now persisted in the database. External delivery (actual SMS/email) requires a backend provider integration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Recipients</CardTitle>
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedStudents.length === recipients.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-slate-500">Loading recipients...</div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recipients.map((recipient) => (
                  <div key={recipient.student_id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
                    <Checkbox
                      id={`student-${recipient.student_id}`}
                      checked={selectedStudents.includes(recipient.student_id)}
                      onCheckedChange={() => toggleStudent(recipient.student_id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`student-${recipient.student_id}`} className="cursor-pointer">
                        <div className="font-medium">{recipient.student_name}</div>
                        <div className="text-sm text-slate-600 mt-1">Parent: {recipient.parent_name}</div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          {recipient.parent_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" />
                              {recipient.parent_email}
                            </span>
                          )}
                          {recipient.parent_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3" />
                              {recipient.parent_phone}
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Message Type</Label>
              <Select value={messageType} onValueChange={(v) => setMessageType(v as MessageChannel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Message</Label>
              <Textarea
                placeholder={messageType === 'sms'
                  ? 'Keep SMS messages short and concise (160 characters recommended)'
                  : 'Write your message to parents...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                maxLength={messageType === 'sms' ? 160 : undefined}
              />
              {messageType === 'sms' && (
                <p className="text-sm text-slate-600 mt-1">{message.length}/160 characters</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Message Preview</h4>
              <div className="text-sm text-slate-600">{selectedStudents.length} recipient(s) selected</div>
              <div className="text-sm text-slate-600">Method: {messageType === 'email' ? 'Email' : 'SMS'}</div>
            </div>

            <Button className="w-full" size="lg" onClick={handleSend}>
              <Send className="size-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMessages.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium uppercase tracking-wide">{item.channel}</span>
                  <span className="text-xs text-slate-500">{new Date(item.sent_date).toLocaleString()}</span>
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">{item.recipient}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
              </div>
            ))}
            {!loading && recentMessages.length === 0 && (
              <div className="py-8 text-center text-slate-500">No message history yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready-Made Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MESSAGE_TEMPLATES.map((template) => (
              <Button
                key={template.title}
                variant="outline"
                className="h-auto py-4 px-4 text-left justify-start"
                onClick={() => applyTemplate(template)}
              >
                <div>
                  <div className="font-medium mb-1">{template.title}</div>
                  <div className="text-xs text-slate-600">Channel: {template.channel.toUpperCase()}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
