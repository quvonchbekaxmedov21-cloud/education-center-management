import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockStudents, type Student } from '../lib/mockData';
import { toast } from 'sonner';

export function Students() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success('Student deleted successfully');
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const studentData: Student = {
      id: editingStudent?.id || String(Date.now()),
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      enrollmentDate: formData.get('enrollmentDate') as string,
      status: formData.get('status') as 'active' | 'inactive',
      grade: formData.get('grade') as string,
      courses: editingStudent?.courses || [],
      groupId: editingStudent?.groupId || 'g1',
      parentName: formData.get('parentName') as string,
      parentPhone: formData.get('parentPhone') as string,
      parentEmail: formData.get('parentEmail') as string,
      discount: Number(formData.get('discount')) || 0,
      paymentStatus: editingStudent?.paymentStatus || 'pending',
      balance: editingStudent?.balance || 0
    };

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? studentData : s));
      toast.success('Student updated successfully');
    } else {
      setStudents([...students, studentData]);
      toast.success('Student added successfully');
    }

    setIsAddDialogOpen(false);
    setEditingStudent(null);
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
            <Input id="parentName" name="parentName" defaultValue={student?.parentName} />
          </div>
          <div>
            <Label htmlFor="parentPhone">Parent Phone</Label>
            <Input id="parentPhone" name="parentPhone" defaultValue={student?.parentPhone} />
          </div>
          <div>
            <Label htmlFor="parentEmail">Parent Email</Label>
            <Input id="parentEmail" name="parentEmail" type="email" defaultValue={student?.parentEmail} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="enrollmentDate">Enrollment Date</Label>
        <Input id="enrollmentDate" name="enrollmentDate" type="date" defaultValue={student?.enrollmentDate} required />
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
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input id="grade" name="grade" defaultValue={student?.grade} />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" name="discount" type="number" defaultValue={student?.discount || 0} />
        </div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Students</h2>
          <p className="text-slate-600 mt-1">Manage student records and enrollments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStudent(null)}>
              <Plus className="size-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                        {student.courses.length} courses enrolled
                      </span>
                      {student.grade && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Grade: {student.grade}
                        </span>
                      )}
                      {student.discount > 0 && (
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {student.discount}% discount
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-700'
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
                    <DialogContent>
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
        </CardContent>
      </Card>
    </div>
  );
}