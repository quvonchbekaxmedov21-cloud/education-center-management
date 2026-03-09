import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { instructorController } from '../../mvc/controllers/instructorController';
import type { InstructorCreateInput, InstructorModel, InstructorUpdateInput } from '../../mvc/models/instructorModel';
import { toast } from 'sonner';

export function Instructors() {
  const [instructors, setInstructors] = useState<InstructorModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const data = await instructorController.listInstructors();
      setInstructors(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor =>
    `${instructor.name} ${instructor.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (instructor.specialization || []).join(', ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await instructorController.deleteInstructor(id);
      setInstructors(instructors.filter(i => i.id !== id));
      toast.success('Instructor deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete instructor');
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const specializationRaw = (formData.get('specialization') as string) || '';
    const specialization = specializationRaw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const instructorData: InstructorCreateInput = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      specialization,
      status: formData.get('status') as 'active' | 'inactive' | 'on_leave',
      join_date: formData.get('join_date') as string,
      hourly_rate: Number(formData.get('hourly_rate')) || 0,
    };

    try {
      if (editingInstructor) {
        const updatePayload: InstructorUpdateInput = {
          ...instructorData,
          id: editingInstructor.id,
        };
        await instructorController.updateInstructor(updatePayload);
        toast.success('Instructor updated successfully');
      } else {
        await instructorController.createInstructor(instructorData);
        toast.success('Instructor added successfully');
      }

      await fetchInstructors();
      setIsAddDialogOpen(false);
      setEditingInstructor(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save instructor');
    }
  };

  const InstructorForm = ({ instructor }: { instructor?: InstructorModel | null }) => (
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
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          name="specialization"
          defaultValue={(instructor?.specialization || []).join(', ')}
          placeholder="English, IELTS, SAT"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="join_date">Join Date</Label>
          <Input id="join_date" name="join_date" type="date" defaultValue={instructor?.join_date} required />
        </div>
        <div>
          <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
          <Input id="hourly_rate" name="hourly_rate" type="number" defaultValue={instructor?.hourly_rate || 0} />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={instructor?.status || 'active'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
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
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading instructors...</div>
          ) : (
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
                      <p className="text-sm text-slate-600">{(instructor.specialization || []).join(', ') || 'General'}</p>
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
                      <span>{(instructor.courses || []).length} courses</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="text-sm">
                      <span className="text-slate-600">Status:</span>
                      <span className="ml-2 font-medium capitalize">{instructor.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">${Number(instructor.hourly_rate || 0).toFixed(2)}/hr</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}