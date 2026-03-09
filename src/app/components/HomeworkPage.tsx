import { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockHomework, mockGroups, type Homework } from '../lib/mockData';
import { toast } from 'sonner';

export function HomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>(mockHomework);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const groupId = formData.get('groupId') as string;
    const group = mockGroups.find(g => g.id === groupId);

    const homeworkData: Homework = {
      id: String(Date.now()),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      groupId,
      groupName: group?.name || '',
      teacherId: group?.teacherId || '',
      teacherName: group?.teacherName || '',
      dueDate: formData.get('dueDate') as string,
      assignedDate: new Date().toISOString().split('T')[0],
      subject: group?.subject || ''
    };

    setHomework([...homework, homeworkData]);
    toast.success('Homework assigned successfully');
    setIsAddDialogOpen(false);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Homework</h2>
          <p className="text-slate-600 mt-1">Assign and track homework</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Assign Homework
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Homework</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="groupId">Group</Label>
                <Select name="groupId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Assign Homework</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {homework.map(hw => {
          const overdue = isOverdue(hw.dueDate);
          return (
            <Card key={hw.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{hw.title}</h3>
                      {overdue && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-4">{hw.description}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">Group:</span>
                        {hw.groupName}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">Teacher:</span>
                        {hw.teacherName}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">Subject:</span>
                        {hw.subject}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Clock className="size-4" />
                      <span>Assigned: {hw.assignedDate}</span>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm ${
                      overdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      Due: {hw.dueDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
