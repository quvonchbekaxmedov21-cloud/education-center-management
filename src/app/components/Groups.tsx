import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockGroups, mockInstructors, mockStudents, type Group } from '../lib/mockData';
import { toast } from 'sonner';

export function Groups() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    toast.success('Group deleted successfully');
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const teacherId = formData.get('teacherId') as string;
    const teacher = mockInstructors.find(t => t.id === teacherId);

    const groupData: Group = {
      id: editingGroup?.id || String(Date.now()),
      name: formData.get('name') as string,
      level: formData.get('level') as 'elementary' | 'intermediate' | 'advanced',
      subject: formData.get('subject') as string,
      teacherId: teacherId,
      teacherName: teacher?.name + ' ' + teacher?.surname || '',
      students: editingGroup?.students || [],
      schedule: formData.get('schedule') as string
    };

    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? groupData : g));
      toast.success('Group updated successfully');
    } else {
      setGroups([...groups, groupData]);
      toast.success('Group added successfully');
    }

    setIsAddDialogOpen(false);
    setEditingGroup(null);
  };

  const GroupForm = ({ group }: { group?: Group | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name</Label>
        <Input id="name" name="name" defaultValue={group?.name} required />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" defaultValue={group?.subject} required />
      </div>
      <div>
        <Label htmlFor="level">Level</Label>
        <Select name="level" defaultValue={group?.level || 'elementary'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="elementary">Elementary</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="teacherId">Teacher</Label>
        <Select name="teacherId" defaultValue={group?.teacherId}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {mockInstructors.map(instructor => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name} {instructor.surname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input id="schedule" name="schedule" defaultValue={group?.schedule} placeholder="e.g., Mon, Wed 10:00 AM" required />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setEditingGroup(null);
        }}>
          Cancel
        </Button>
        <Button type="submit">
          {group ? 'Update' : 'Add'} Group
        </Button>
      </div>
    </form>
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'elementary': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Groups</h2>
          <p className="text-slate-600 mt-1">Manage class groups and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGroup(null)}>
              <Plus className="size-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Group</DialogTitle>
            </DialogHeader>
            <GroupForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => {
              const studentsInGroup = mockStudents.filter(s => group.students.includes(s.id));
              return (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{group.subject}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getLevelColor(group.level)}`}>
                        {group.level}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="size-4" />
                        <span>{group.teacherName}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {group.schedule}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{studentsInGroup.length} students</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setEditingGroup(group)}
                          >
                            <Edit className="size-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Group</DialogTitle>
                          </DialogHeader>
                          <GroupForm group={group} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
