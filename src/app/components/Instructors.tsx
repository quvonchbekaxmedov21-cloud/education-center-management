import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { mockInstructors, type Instructor } from '../lib/mockData';
import { toast } from 'sonner';

export function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setInstructors(instructors.filter(i => i.id !== id));
    toast.success('Instructor deleted successfully');
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const instructorData: Instructor = {
      id: editingInstructor?.id || String(Date.now()),
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      specialty: formData.get('specialty') as string,
      experience: formData.get('experience') as string,
      rating: Number(formData.get('rating')),
      courses: editingInstructor?.courses || [],
      groups: editingInstructor?.groups || [],
      salary: Number(formData.get('salary')) || 0,
      salaryStatus: editingInstructor?.salaryStatus || 'pending',
      lastPaymentDate: editingInstructor?.lastPaymentDate
    };

    if (editingInstructor) {
      setInstructors(instructors.map(i => i.id === editingInstructor.id ? instructorData : i));
      toast.success('Instructor updated successfully');
    } else {
      setInstructors([...instructors, instructorData]);
      toast.success('Instructor added successfully');
    }

    setIsAddDialogOpen(false);
    setEditingInstructor(null);
  };

  const InstructorForm = ({ instructor }: { instructor?: Instructor | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">First Name</Label>
          <Input id="name" name="name" defaultValue={instructor?.name} required />
        </div>
        <div>
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" name="surname" defaultValue={instructor?.surname} required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={instructor?.email} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={instructor?.phone} required />
      </div>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Input id="specialty" name="specialty" defaultValue={instructor?.specialty} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experience">Experience</Label>
          <Input id="experience" name="experience" defaultValue={instructor?.experience} placeholder="e.g., 10 years" required />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={instructor?.rating} required />
        </div>
      </div>
      <div>
        <Label htmlFor="salary">Monthly Salary ($)</Label>
        <Input id="salary" name="salary" type="number" defaultValue={instructor?.salary} required />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setEditingInstructor(null);
        }}>
          Cancel
        </Button>
        <Button type="submit">
          {instructor ? 'Update' : 'Add'} Instructor
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Instructors</h2>
          <p className="text-slate-600 mt-1">Manage teaching staff and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingInstructor(null)}>
              <Plus className="size-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
            </DialogHeader>
            <InstructorForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-lg">
                      {(instructor.name[0] + instructor.surname[0]).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{instructor.name} {instructor.surname}</h3>
                      <p className="text-sm text-slate-600">{instructor.specialty}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="size-4 flex-shrink-0" />
                      <span className="truncate">{instructor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="size-4 flex-shrink-0" />
                      <span>{instructor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="size-4 flex-shrink-0" />
                      <span>{instructor.courses.length} courses</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="text-sm">
                      <span className="text-slate-600">Experience:</span>
                      <span className="ml-2 font-medium">{instructor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingInstructor(instructor)}
                        >
                          <Edit className="size-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Instructor</DialogTitle>
                        </DialogHeader>
                        <InstructorForm instructor={instructor} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(instructor.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}