import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { studentController } from '../../mvc/controllers/studentController';
import type {
  StudentCreateInput,
  StudentModel,
  StudentStatus,
  StudentUpdateInput,
} from '../../mvc/models/studentModel';
import { toast } from 'sonner';

type Student = StudentModel;

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch students from Supabase
  useEffect(() => {
    void fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentController.listStudents();
      setStudents(data);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await studentController.deleteStudent(id);

      setStudents(students.filter(s => s.id !== id));
      toast.success('Student deleted successfully');
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error(error.message || 'Failed to delete student');
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const studentData: StudentCreateInput = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      parent_name: formData.get('parentName') as string || null,
      parent_phone: formData.get('parentPhone') as string || null,
      status: formData.get('status') as StudentStatus,
      join_date: formData.get('enrollmentDate') as string,
    };

    try {
      if (editingStudent) {
        const updatePayload: StudentUpdateInput = {
          ...studentData,
          id: editingStudent.id,
        };
        await studentController.updateStudent(updatePayload);
        toast.success('Student updated successfully');
      } else {
        await studentController.createStudent(studentData);
        toast.success('Student added successfully');
      }

      // Refresh students list
      await fetchStudents();
      setIsAddDialogOpen(false);
      setEditingStudent(null);
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast.error(error.message || 'Failed to save student');
    }
  };

  const StudentForm = ({ student }: { student?: Student | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">First Name</Label>
          <Input id="name" name="name" defaultValue={student?.name} required />
        </div>
        <div>
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" name="surname" defaultValue={student?.surname} required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={student?.email} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={student?.phone} required />
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Parent Information</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="parentName">Parent Name</Label>
            <Input id="parentName" name="parentName" defaultValue={student?.parent_name || ''} />
          </div>
          <div>
            <Label htmlFor="parentPhone">Parent Phone</Label>
            <Input id="parentPhone" name="parentPhone" defaultValue={student?.parent_phone || ''} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="enrollmentDate">Enrollment Date</Label>
        <Input id="enrollmentDate" name="enrollmentDate" type="date" defaultValue={student?.join_date} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={student?.status || 'active'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setEditingStudent(null);
        }}>
          Cancel
        </Button>
        <Button type="submit">
          {student ? 'Update' : 'Add'} Student
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Students</h2>
          <p className="text-slate-600 mt-1">Manage student records and enrollments</p>
          <p className="text-xs text-slate-500 mt-2">
            Enrollment policy: admins assign students to courses (students do not self-enroll).
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStudent(null)}>
              <Plus className="size-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No students found. Add your first student to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {(student.name[0] + (student.surname?.[0] || '')).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{student.name} {student.surname}</div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="size-3" />
                          {student.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {student.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-slate-600">
                          {student.enrolled_courses?.length || 0} courses enrolled
                        </span>
                        {student.parent_name && (
                          <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            Parent: {student.parent_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : student.status === 'graduated'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {student.status}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingStudent(student)}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Student</DialogTitle>
                        </DialogHeader>
                        <StudentForm student={student} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
