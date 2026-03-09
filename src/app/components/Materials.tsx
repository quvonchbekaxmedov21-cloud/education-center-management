import { useEffect, useState } from 'react';
import { Plus, Download, FileText, Video, File, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { materialController } from '../../mvc/controllers/materialController';
import type { MaterialCreateInput, MaterialRecordView } from '../../mvc/models/materialModel';
import { toast } from 'sonner';

export function Materials() {
  const [materials, setMaterials] = useState<MaterialRecordView[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; level?: string }>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materialData, courseData] = await Promise.all([
        materialController.listMaterials(),
        materialController.listCourses(),
      ]);
      setMaterials(materialData);
      setCourses(courseData as Array<{ id: string; name: string; level?: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = selectedCourse === 'all'
    ? materials
    : materials.filter(m => m.course_id === selectedCourse);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const materialData: MaterialCreateInput = {
      course_id: formData.get('course_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      file_type: formData.get('file_type') as string,
      file_url: formData.get('file_url') as string,
    };

    try {
      await materialController.createMaterial(materialData);
      toast.success('Material added successfully');
      await loadData();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add material');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="size-5 text-red-600" />;
      case 'video': return <Video className="size-5 text-blue-600" />;
      case 'link': return <LinkIcon className="size-5 text-green-600" />;
      default: return <File className="size-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Learning Materials</h2>
          <p className="text-slate-600 mt-1">Course materials and resources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Material</DialogTitle>
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
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} {course.level ? `(${course.level})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file_type">Type</Label>
                <Select name="file_type" defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file_url">File URL</Label>
                <Input id="file_url" name="file_url" placeholder="https://..." required />
                <p className="text-sm text-slate-600 mt-1">Use a public or signed URL from cloud storage.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Material</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCourse === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCourse('all')}
        >
          All Courses
        </Button>
        {courses.map(course => (
          <Button
            key={course.id}
            variant={selectedCourse === course.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCourse(course.id)}
          >
            {course.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="col-span-full text-center py-8 text-slate-500">Loading materials...</div>}
        {filteredMaterials.map(material => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  {getTypeIcon(material.file_type || 'document')}
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  </a>
                </Button>
              </div>
              <h3 className="font-semibold mb-2">{material.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{material.description}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-slate-600">{material.course_name}</span>
                <span className="text-xs text-slate-500">{material.uploaded_date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="size-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No materials found for this course</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
