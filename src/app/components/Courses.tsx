import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { courseController } from '../../mvc/controllers/courseController';
import type {
  CourseCreateInput,
  CourseRecordView,
  CourseStatus,
  CourseUpdateInput,
} from '../../mvc/models/courseModel';
import { toast } from 'sonner';

export function Courses() {
  const [courses, setCourses] = useState<CourseRecordView[]>([]);
  const [instructors, setInstructors] = useState<Array<{ id: string; name: string; surname: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecordView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseData, instructorData] = await Promise.all([
        courseController.listCourses(),
        courseController.listInstructors(),
      ]);
      setCourses(courseData);
      setInstructors(instructorData as Array<{ id: string; name: string; surname: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await courseController.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: CourseCreateInput = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      instructor_id: (formData.get('instructor_id') as string) || null,
      schedule: (formData.get('schedule') as string) || null,
      duration: (formData.get('duration') as string) || null,
      capacity: Number(formData.get('capacity')),
      price: Number(formData.get('price')),
      status: formData.get('status') as CourseStatus,
      level: (formData.get('level') as string) || null,
    };

    try {
      if (editingCourse) {
        const updatePayload: CourseUpdateInput = { ...payload, id: editingCourse.id };
        await courseController.updateCourse(updatePayload);
        toast.success('Course updated successfully');
      } else {
        await courseController.createCourse(payload);
        toast.success('Course added successfully');
      }

      await loadData();
      setIsAddDialogOpen(false);
      setEditingCourse(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    }
  };

  const CourseForm = ({ course }: { course?: CourseRecordView | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <Label htmlFor="name">Course Name</Label>
        <Input id="name" name="name" defaultValue={course?.name} required />
      </div>
      <div>
        <Label htmlFor="code">Course Code</Label>
        <Input id="code" name="code" defaultValue={course?.code} required />
      </div>
      <div>
        <Label htmlFor="instructor_id">Instructor</Label>
        <Select name="instructor_id" defaultValue={course?.instructor_id || undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select instructor" />
          </SelectTrigger>
          <SelectContent>
            {instructors.map((instructor) => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name} {instructor.surname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input id="schedule" name="schedule" defaultValue={course?.schedule || ''} placeholder="e.g., Mon, Wed 10:00 AM" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" defaultValue={course?.capacity} required />
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" defaultValue={course?.price} required />
        </div>
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" name="duration" defaultValue={course?.duration} placeholder="e.g., 12 weeks" required />
      </div>
      <div>
        <Label htmlFor="level">Level</Label>
        <Input id="level" name="level" defaultValue={course?.level || ''} placeholder="beginner/intermediate/advanced" />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={course?.status || 'active'}>
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
          setEditingCourse(null);
        }}>
          Cancel
        </Button>
        <Button type="submit">
          {course ? 'Update' : 'Add'} Course
        </Button>
      </div>
    </form>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Courses</h2>
          <p className="text-slate-600 mt-1">Manage course offerings and schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCourse(null)}>
              <Plus className="size-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading courses...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => {
              const enrollmentPercentage = course.capacity > 0 ? (course.enrolled / course.capacity) * 100 : 0;
              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{course.code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="size-4" />
                        <span>Instructor: {course.instructor_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-4" />
                        <span>{course.schedule || 'Schedule TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="size-4" />
                        <span>${course.price} • {course.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Enrollment</span>
                        <span className="font-medium">{course.enrolled} / {course.capacity}</span>
                      </div>
                      <Progress value={enrollmentPercentage} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setEditingCourse(course)}
                          >
                            <Edit className="size-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                          </DialogHeader>
                          <CourseForm course={course} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
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
