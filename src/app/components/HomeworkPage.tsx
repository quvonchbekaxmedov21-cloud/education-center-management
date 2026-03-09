import { useEffect, useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { homeworkController } from '../../mvc/controllers/homeworkController';
import type { HomeworkCreateInput, HomeworkRecordView } from '../../mvc/models/homeworkModel';
import { toast } from 'sonner';

export function HomeworkPage() {
  const [homework, setHomework] = useState<HomeworkRecordView[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; level?: string }>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [homeworkData, courseData] = await Promise.all([
        homeworkController.listHomework(),
        homeworkController.listCourses(),
      ]);
      setHomework(homeworkData);
      setCourses(courseData as Array<{ id: string; name: string; level?: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: HomeworkCreateInput = {
      course_id: formData.get('course_id') as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      due_date: formData.get('due_date') as string,
      max_points: Number(formData.get('max_points') || 100),
    };

    try {
      await homeworkController.createHomework(payload);
      toast.success('Homework assigned successfully');
      await loadData();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign homework');
    }
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const stats = {
    total: homework.length,
    overdue: homework.filter((hw) => isOverdue(hw.due_date)).length,
    upcoming: homework.filter((hw) => !isOverdue(hw.due_date)).length,
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
                <Label htmlFor="course_id">Course</Label>
                <Select name="course_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} {course.level ? `(${course.level})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" name="due_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="max_points">Max Points</Label>
                <Input id="max_points" name="max_points" type="number" min="1" defaultValue="100" required />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">Total Assignments</p>
            <p className="text-2xl font-semibold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">Upcoming</p>
            <p className="text-2xl font-semibold mt-1 text-blue-700">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">Overdue</p>
            <p className="text-2xl font-semibold mt-1 text-red-700">{stats.overdue}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {loading && <Card><CardContent className="p-8 text-center text-slate-500">Loading homework...</CardContent></Card>}
        {!loading && homework.map((hw) => {
          const overdue = isOverdue(hw.due_date);
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
                    <p className="text-slate-600 mb-4">{hw.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">Course:</span>
                        {hw.course_name}
                      </span>
                      <span className="flex items-center gap-2"><span className="font-medium">Max Points:</span>{hw.max_points}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Clock className="size-4" />
                      <span>Assigned: {hw.assigned_date}</span>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm ${
                      overdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      Due: {hw.due_date}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!loading && homework.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Homework Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">Create your first assignment to get started.</CardContent>
        </Card>
      )}
    </div>
  );
}
