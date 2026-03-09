import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { groupController } from '../../mvc/controllers/groupController';
import type { GroupCreateInput, GroupUpdateInput, GroupWithRelations } from '../../mvc/models/groupModel';
import { toast } from 'sonner';

export function Groups() {
  const [groups, setGroups] = useState<GroupWithRelations[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; level?: string }>>([]);
  const [instructors, setInstructors] = useState<Array<{ id: string; name: string; surname: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupData, courseData, instructorData] = await Promise.all([
        groupController.listGroups(),
        groupController.listCourseOptions(),
        groupController.listInstructorOptions(),
      ]);
      setGroups(groupData);
      setCourses(courseData as Array<{ id: string; name: string; level?: string }>);
      setInstructors(instructorData as Array<{ id: string; name: string; surname: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.course_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await groupController.deleteGroup(id);
      setGroups(groups.filter(g => g.id !== id));
      toast.success('Group deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete group');
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const groupData: GroupCreateInput = {
      name: formData.get('name') as string,
      course_id: formData.get('course_id') as string,
      instructor_id: formData.get('instructor_id') as string,
      schedule: (formData.get('schedule') as string) || null,
      room: (formData.get('room') as string) || null,
      capacity: Number(formData.get('capacity')) || 0,
      status: formData.get('status') as 'active' | 'completed' | 'upcoming',
    };

    try {
      if (editingGroup) {
        const payload: GroupUpdateInput = { ...groupData, id: editingGroup.id };
        await groupController.updateGroup(payload);
        toast.success('Group updated successfully');
      } else {
        await groupController.createGroup(groupData);
        toast.success('Group added successfully');
      }

      await loadData();
      setIsAddDialogOpen(false);
      setEditingGroup(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save group');
    }
  };

  const GroupForm = ({ group }: { group?: GroupWithRelations | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name</Label>
        <Input id="name" name="name" defaultValue={group?.name} required />
      </div>
      <div>
        <Label htmlFor="course_id">Course</Label>
        <Select name="course_id" defaultValue={group?.course_id || undefined} required>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.name} {course.level ? `(${course.level})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="instructor_id">Instructor</Label>
        <Select name="instructor_id" defaultValue={group?.instructor_id || undefined} required>
          <SelectTrigger>
            <SelectValue placeholder="Select instructor" />
          </SelectTrigger>
          <SelectContent>
            {instructors.map(instructor => (
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Room</Label>
          <Input id="room" name="room" defaultValue={group?.room || ''} />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" defaultValue={group?.capacity || 0} />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={group?.status || 'active'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
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
      case 'beginner': return 'bg-green-100 text-green-700';
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
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading groups...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => {
              const studentCount = (group.students || []).length;
              return (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{group.course_name || 'No course assigned'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getLevelColor(group.course_level || '')}`}>
                        {group.course_level || 'N/A'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="size-4" />
                        <span>{group.instructor_name || 'No instructor'}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {group.schedule}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{studentCount} students</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
