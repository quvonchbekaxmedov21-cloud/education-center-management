import { useState } from 'react';
import { Send, MessageSquare, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { mockStudents } from '../lib/mockData';
import { toast } from 'sonner';

export function ParentMessaging() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === mockStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(mockStudents.map(s => s.id));
    }
  };

  const handleSend = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // In a real app, this would send actual messages
    toast.success(`Message sent to ${selectedStudents.length} parent(s) via ${messageType}`);
    setMessage('');
    setSelectedStudents([]);
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
              <h3 className="font-semibold text-yellow-900 mb-1">SMS Feature Note</h3>
              <p className="text-sm text-yellow-800">
                SMS messaging requires integration with a service like Twilio and cannot be implemented purely in the frontend.
                This interface demonstrates the UI, but actual SMS sending would require backend infrastructure.
                For now, you can use this to compose and track messages that would be sent.
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
                {selectedStudents.length === mockStudents.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {mockStudents.map(student => (
                <div key={student.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`student-${student.id}`} className="cursor-pointer">
                      <div className="font-medium">{student.name} {student.surname}</div>
                      {student.parentName && (
                        <div className="text-sm text-slate-600 mt-1">
                          Parent: {student.parentName}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        {student.parentEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" />
                            {student.parentEmail}
                          </span>
                        )}
                        {student.parentPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" />
                            {student.parentPhone}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Message Type</Label>
              <Select value={messageType} onValueChange={(v) => setMessageType(v as 'email' | 'sms')}>
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
                      SMS (Requires Backend)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Message</Label>
              <Textarea
                placeholder={messageType === 'sms' 
                  ? "Keep SMS messages short and concise (160 characters recommended)"
                  : "Write your message to parents..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                maxLength={messageType === 'sms' ? 160 : undefined}
              />
              {messageType === 'sms' && (
                <p className="text-sm text-slate-600 mt-1">
                  {message.length}/160 characters
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Message Preview</h4>
              <div className="text-sm text-slate-600">
                {selectedStudents.length} recipient(s) selected
              </div>
              <div className="text-sm text-slate-600">
                Method: {messageType === 'email' ? 'Email' : 'SMS'}
              </div>
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
          <CardTitle>Message Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 px-4 text-left justify-start"
              onClick={() => setMessage("Dear Parent, This is to inform you about your child's excellent progress this week. Keep up the great work!")}
            >
              <div>
                <div className="font-medium mb-1">Progress Update</div>
                <div className="text-xs text-slate-600">Positive feedback template</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-4 text-left justify-start"
              onClick={() => setMessage("Dear Parent, This is a reminder that payment for this month is due. Please contact us for any questions.")}
            >
              <div>
                <div className="font-medium mb-1">Payment Reminder</div>
                <div className="text-xs text-slate-600">Fee reminder template</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-4 text-left justify-start"
              onClick={() => setMessage("Dear Parent, Your child was absent today. Please let us know if everything is okay.")}
            >
              <div>
                <div className="font-medium mb-1">Absence Notice</div>
                <div className="text-xs text-slate-600">Attendance notification</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-4 text-left justify-start"
              onClick={() => setMessage("Dear Parent, We have scheduled a parent-teacher meeting. Please confirm your availability.")}
            >
              <div>
                <div className="font-medium mb-1">Meeting Invitation</div>
                <div className="text-xs text-slate-600">Schedule meeting template</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
